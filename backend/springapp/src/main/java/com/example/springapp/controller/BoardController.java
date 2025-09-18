package com.example.springapp.controller;

import com.example.springapp.model.Board;
import com.example.springapp.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')") // Both admin and user can view boards
    public Page<Board> getBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return boardService.getBoards(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @boardService.getBoardById(#id).project.owner.id == principal.id)") // Admin or project owner can view by ID
    public Board getBoard(@PathVariable Long id) {
        return boardService.getBoardById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can create boards
    public Board createBoard(@RequestBody Board board) {
        return boardService.createBoard(board);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can update boards
    public Board updateBoard(@PathVariable Long id, @RequestBody Board board) {
        return boardService.updateBoard(id, board);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete boards
    public void deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
    }

    @GetMapping("/by-project/{projectId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @projectService.getProjectById(#projectId).owner.id == principal.id)") // Admin or project owner can view boards by project
    public Page<Board> getBoardsByProject(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return boardService.getBoardsByProjectId(projectId, pageable);
    }
}
