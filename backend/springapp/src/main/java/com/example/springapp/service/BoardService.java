package com.example.springapp.service;

import com.example.springapp.model.Board;
import com.example.springapp.model.Project;
import com.example.springapp.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ProjectService projectService; // Inject ProjectService

    public Page<Board> getBoards(Pageable pageable) {
        return boardRepository.findAll(pageable);
    }

    public Board getBoardById(Long id) {
        return boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public Board createBoard(Board board) {
        if (board.getProjectId() != null) {
            Project project = projectService.getProjectById(board.getProjectId());
            board.setProject(project);
        }
        return boardRepository.save(board);
    }

    public Board updateBoard(Long id, Board boardDetails) {
        Board board = getBoardById(id);
        board.setName(boardDetails.getName());
        board.setTitle(boardDetails.getTitle()); // Add title update
        board.setDescription(boardDetails.getDescription()); // Add description update

        if (boardDetails.getProjectId() != null) {
            Project project = projectService.getProjectById(boardDetails.getProjectId());
            board.setProject(project);
        } else if (boardDetails.getProjectId() == null) { // Allow disassociating project
            board.setProject(null);
        }
        return boardRepository.save(board);
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    public Page<Board> getBoardsByProjectId(Long projectId, Pageable pageable) {
        return boardRepository.findByProjectId(projectId, pageable);
    }
}
