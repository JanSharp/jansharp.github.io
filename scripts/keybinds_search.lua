
local io_util = require("io_util") -- phobos
local ast_walker = require("ast_walker") -- phobos
local messages = require("messages") -- multi_process_phobos, currently not open source
local Path = require("lib.LuaPath.path") -- phobos
local json = require("../scripts/json_util") -- phobos

---key_sequence => prototype[]
---@type table<string, {mod_name: string, name: string?, consuming: "none"|"game-only"|"unknown", is_controller: boolean}[]>
local key_sequence_count_lut = {}

local function finish_summary()
  ---@type {key_sequence: string, unique_count: integer, prototypes: {mod_name: string, name: string?, consuming: "none"|"game-only"|"unknown", is_controller: boolean}[]}[]
  local ordered = {}

  for key_sequence, prototypes in pairs(key_sequence_count_lut) do
    local data = {
      key_sequence = key_sequence,
      unique_count = 0,
      prototypes = prototypes,
    }
    local name_lut = {
      [false] = {
        ["none" ] = {},
        ["game-only" ] = {},
        ["unknown" ] = {},
      },
      [true] = {
        ["none" ] = {},
        ["game-only" ] = {},
        ["unknown" ] = {},
      },
    }
    for _, prototype in ipairs(prototypes) do
      if name_lut[prototype.is_controller][prototype.consuming][prototype.name] then goto continue end
      name_lut[prototype.is_controller][prototype.consuming][prototype.name] = true
      data.unique_count = data.unique_count + 1
      ::continue::
    end
    ordered[#ordered+1] = data
  end

  table.sort(ordered, function(left, right)
    if left.unique_count == right.unique_count then
      return left.key_sequence < right.key_sequence
    end
    return left.unique_count > right.unique_count
  end)

  local string_count = 0
  local string_list = {}
  local string_index_lut = {}
  local function deduplicate_string(str)
    local index = string_index_lut[str]
    if index then return index - 1 end
    string_count = string_count + 1
    string_list[string_count] = str
    string_index_lut[str] = string_count
    return string_count - 1
  end

  local data = {}
  local function get_name(name)
    return type(name) == "table" and "" or name
  end
  for _, seq_data in ipairs(ordered) do
    local prototypes = {}
    if seq_data.unique_count >= 1 then
      table.sort(seq_data.prototypes, function(left, right)
        if left.name == right.name then
          if left.mod_name:lower() == right.mod_name:lower() then
            return left.consuming < right.consuming
          end
          return left.mod_name:lower() < right.mod_name:lower()
        end
        return get_name(left.name):lower() < get_name(right.name):lower()
      end)
      for i, prototype in ipairs(seq_data.prototypes) do
        local mod_name, major, minor, patch = prototype.mod_name:match("^(.*)_(%d+)%.(%d+)%.(%d+)$")
        assert(mod_name)
        prototypes[i] = {
          deduplicate_string(get_name(prototype.name)),
          prototype.is_controller and 1 or 0,
          deduplicate_string(mod_name),
          tonumber(major),
          tonumber(minor),
          tonumber(patch),
          prototype.consuming == "none" and 1
            or prototype.consuming == "game-only" and 2
            or 0,
        }
      end
    end
    data[#data+1] = {
      seq_data.key_sequence,
      seq_data.unique_count,
      prototypes,
    }
  end

  print(json.to_json({
    version = 1,
    date = os.date("!%FT%T+00:00"), -- Basically ISO 8601 date and time. https://en.cppreference.com/w/cpp/chrono/c/strftime
    strings = string_list,
    data = data,
  }, {default_empty_table_type = "array"}))
end

local add_key_sequence = messages.register(function(key_sequence, name, consuming, is_controller, source)
  if not key_sequence or key_sequence == "" then return end
  name = name or {} -- If nil, make it unique.

  local prototypes = key_sequence_count_lut[key_sequence]
  if not prototypes then
    prototypes = {}
    key_sequence_count_lut[key_sequence] = prototypes
  end

  prototypes[#prototypes+1] = {
    mod_name = Path.new(source):sub(1, 1):str(),
    name = name,
    consuming = consuming,
    is_controller = is_controller,
  }
end)

local print = messages.register(_ENV.print)

--------------------------------------------------------------------------------------------------------------

---@type string
local source

---@param key_sequence string?
---@param lower boolean? @ Keyboard key sequences are all upper case, controller ones all lower case.
---@return string?
local function normalize(key_sequence, lower)
  if not key_sequence then return end
  key_sequence = lower and key_sequence:lower() or key_sequence:upper()
  key_sequence = key_sequence:gsub("%s*%+%s*", " + ")
  return key_sequence
end

---@param expr AstExpression
---@return string?
local function get_string(expr)
  if expr.node_type == "string" then ---@cast expr AstString
    return expr.value
  elseif expr.node_type == "concat" then ---@cast expr AstConcat
    -- TODO: combine
    -- print("concat?")
  end
end

local on_open = {
  ---@param node AstAssignment
  ["assignment"] = function(node)
    for i = 1, #node.lhs do
      local lhs = node.lhs[i]
      if lhs.node_type == "index" then ---@cast lhs AstIndex
        local suffix = lhs.suffix
        if suffix.node_type == "string" then ---@cast suffix AstString
          local is_keyboard = suffix.value == "key_sequence"
            or suffix.value == "alternate_key_sequence"
          local is_controller = suffix.value == "controller_key_sequence"
            or suffix.value == "controller_alternate_key_sequence"
          if is_keyboard or is_controller then
            local rhs = node.rhs[i]
            local key_sequence = normalize(get_string(rhs))
            if key_sequence and key_sequence ~= "" then
              add_key_sequence(key_sequence, nil, "unknown", is_controller, source)
            end
          end
        end
      end
    end
  end,
  ---@param node AstConstructor
  ["constructor"] = function(node)
    local prototype_type
    local name
    local key_sequence
    local alternate_key_sequence
    local controller_key_sequence
    local controller_alternate_key_sequence
    local consuming
    local linked_game_control
    for _, field in ipairs(node.fields) do
      if field.type == "rec" then ---@cast field AstRecordField
        local key = field.key
        if key.node_type == "string" then ---@cast key AstString
          if key.value == "type" then
            prototype_type = get_string(field.value)
          elseif key.value == "name" then
            name = get_string(field.value)
          elseif key.value == "key_sequence" then
            key_sequence = normalize(get_string(field.value))
          elseif key.value == "alternate_key_sequence" then
            alternate_key_sequence = normalize(get_string(field.value))
          elseif key.value == "controller_key_sequence" then
            controller_key_sequence = normalize(get_string(field.value), true)
          elseif key.value == "controller_alternate_key_sequence" then
            controller_alternate_key_sequence = normalize(get_string(field.value), true)
          elseif key.value == "consuming" then
            consuming = get_string(field.value) or "unknown"
          elseif key.value == "linked_game_control" then
            linked_game_control = get_string(field.value)
          end
        end
      end
    end
    if prototype_type == "custom-input"
      and name
      and (not linked_game_control or linked_game_control == "")
    then
      if not consuming then
        consuming = "none"
      elseif consuming ~= "none" and consuming ~= "game-only" then
        consuming = "unknown"
      end
      if key_sequence then
        add_key_sequence(key_sequence, name, consuming, false, source)
      end
      if alternate_key_sequence then
        add_key_sequence(alternate_key_sequence, name, consuming, false, source)
      end
      if controller_key_sequence then
        add_key_sequence(controller_key_sequence, name, consuming, true, source)
      end
      if controller_alternate_key_sequence then
        add_key_sequence(controller_alternate_key_sequence, name, consuming, true, source)
      end
    end
  end,
}

---@param file_data FileData
local function process_file(file_data)
  if not file_data.cache_path:exists() then return end

  ---@type AstMain
  local ast = load(io_util.read_file(file_data.cache_path:str()..".stripped"))()
  source = file_data.relative_path:str()
  ast_walker.walk_scope(ast, ast_walker.new_context(on_open))
end

---@type ScriptDefinition
local script = {
  finish_summary = finish_summary,
  process_file = process_file,
}
return script
