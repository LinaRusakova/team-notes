package com.gbdevteam.teamnotes.repository;

import com.gbdevteam.teamnotes.model.Board;
import com.gbdevteam.teamnotes.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID> {
}
