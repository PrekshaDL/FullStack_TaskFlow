package com.example.springapp.controller;

import com.example.springapp.model.Board;
import com.example.springapp.dto.BoardDTO;
import com.example.springapp.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public Page<Board> getBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return boardService.getBoards(pageable);
    }

    @GetMapping("/{id}")
    public Board getBoard(@PathVariable Long id) {
        return boardService.getBoardById(id);
    }

    @PostMapping
    public Board createBoard(@RequestBody BoardDTO boardDTO) {
        // Convert DTO to Entity
        Board board = new Board();
        // Don't set ID - let Hibernate generate it
        board.setName(boardDTO.getName());
        board.setTitle(boardDTO.getTitle());
        board.setDescription(boardDTO.getDescription());
        // Note: project relationship would need to be set separately
        // based on projectId from the DTO
        return boardService.createBoard(board);
    }

    @PutMapping("/{id}")
    public Board updateBoard(@PathVariable Long id, @RequestBody BoardDTO boardDTO) {
        // Convert DTO to Entity
        Board board = new Board();
        board.setId(id);
        board.setName(boardDTO.getName());
        board.setTitle(boardDTO.getTitle());
        board.setDescription(boardDTO.getDescription());
        // Note: project relationship would need to be set separately
        // based on projectId from the DTO
        return boardService.updateBoard(id, board);
    }

    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
    }
}
