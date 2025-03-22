"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.deleteTask = exports.createTask = exports.getAllTasks = void 0;
const config_db_1 = __importDefault(require("../../config/config-db"));
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield config_db_1.default.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllTasks = getAllTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ message: 'Task description is required' });
        }
        const [result] = yield config_db_1.default.query('INSERT INTO tasks (description) VALUES (?)', [description]);
        const id = result.insertId;
        const newTask = {
            id,
            description,
            is_completed: false,
            created_at: new Date().toISOString()
        };
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createTask = createTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield config_db_1.default.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteTask = deleteTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { is_completed, description } = req.body;
        // Build the SQL query based on what fields are provided
        let updateQuery = 'UPDATE tasks SET ';
        const updateValues = [];
        if (is_completed !== undefined) {
            updateQuery += 'is_completed = ?';
            updateValues.push(is_completed);
        }
        if (description !== undefined) {
            if (updateValues.length > 0) {
                updateQuery += ', ';
            }
            updateQuery += 'description = ?';
            updateValues.push(description);
        }
        // If neither field was provided, return an error
        if (updateValues.length === 0) {
            return res.status(400).json({ message: 'No fields to update provided' });
        }
        // Complete the query
        updateQuery += ' WHERE id = ?';
        updateValues.push(id);
        yield config_db_1.default.query(updateQuery, updateValues);
        res.json({ message: 'Task updated successfully' });
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateTask = updateTask;
