package com.example.springapp.service;

import com.example.springapp.model.Board;
import com.example.springapp.model.Task;
import com.example.springapp.model.User;
import com.example.springapp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardService boardService; // Inject BoardService

    @Autowired
    private UserService userService; // Inject UserService

    public Page<Task> getTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task createTask(Task task) {
        if (task.getBoardId() != null) {
            Board board = boardService.getBoardById(task.getBoardId());
            task.setBoard(board);
        }
        if (task.getAssigneeId() != null) {
            User assignee = userService.getUserById(task.getAssigneeId());
            task.setAssignee(assignee);
        }
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());

        if (taskDetails.getBoardId() != null) {
            Board board = boardService.getBoardById(taskDetails.getBoardId());
            task.setBoard(board);
        } else if (taskDetails.getBoardId() == null) { // Allow disassociating board
            task.setBoard(null);
        }

        if (taskDetails.getAssigneeId() != null) {
            User assignee = userService.getUserById(taskDetails.getAssigneeId());
            task.setAssignee(assignee);
        } else if (taskDetails.getAssigneeId() == null) { // Allow disassociating assignee
            task.setAssignee(null);
        }
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Page<Task> getTasksByAssigneeId(Long assigneeId, Pageable pageable) {
        return taskRepository.findByAssigneeId(assigneeId, pageable);
    }

    public Page<Task> getTasksByBoardId(Long boardId, Pageable pageable) {
        return taskRepository.findByBoardId(boardId, pageable);
    }
}
