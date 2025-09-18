package com.example.springapp.controller;

import com.example.springapp.model.Project;
import com.example.springapp.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')") // Both admin and user can view projects
    public Page<Project> getProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return projectService.getProjects(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @projectService.getProjectById(#id).owner.id == principal.id)") // Admin or project owner can view by ID
    public Project getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can create projects
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can update projects
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete projects
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @GetMapping("/by-owner/{ownerId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #ownerId == principal.id)") // Admin or owner can view their projects
    public Page<Project> getProjectsByOwner(
            @PathVariable Long ownerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return projectService.getProjectsByOwnerId(ownerId, pageable);
    }
}
