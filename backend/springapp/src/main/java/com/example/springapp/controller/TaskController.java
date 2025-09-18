package com.example.springapp.controller;

import com.example.springapp.model.Task;
import com.example.springapp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')") // Both admin and user can view tasks
    public Page<Task> getTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return taskService.getTasks(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')") // Admin or User can view by ID
    public Task getTask(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PostMapping
    @PreAuthorize("permitAll()")  // 👈 TEMPORARY: allow anyone to create tasks
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can update any task
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete tasks
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @GetMapping("/by-assignee/{assigneeId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')") 
    public Page<Task> getTasksByAssignee(
            @PathVariable Long assigneeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return taskService.getTasksByAssigneeId(assigneeId, pageable);
    }

    @GetMapping("/by-board/{boardId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')") 
    public Page<Task> getTasksByBoard(
            @PathVariable Long boardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return taskService.getTasksByBoardId(boardId, pageable);
    }
}
