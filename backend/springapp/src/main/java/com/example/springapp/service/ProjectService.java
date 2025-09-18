package com.example.springapp.service;

import com.example.springapp.model.Project;
import com.example.springapp.model.User;
import com.example.springapp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService; // Inject UserService

    public Page<Project> getProjects(Pageable pageable) {
        return projectRepository.findAll(pageable);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project createProject(Project project) {
        if (project.getOwnerId() != null) {
            User owner = userService.getUserById(project.getOwnerId());
            project.setOwner(owner);
        }
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setStatus(projectDetails.getStatus()); // Update status
        if (projectDetails.getOwnerId() != null) {
            User owner = userService.getUserById(projectDetails.getOwnerId());
            project.setOwner(owner);
        } else if (projectDetails.getOwnerId() == null) { // Allow disassociating owner
            project.setOwner(null);
        }
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public Page<Project> getProjectsByOwnerId(Long ownerId, Pageable pageable) {
        return projectRepository.findByOwnerId(ownerId, pageable);
    }
}
