package com.yabar.backend.controller;

import com.yabar.backend.model.Producto;
import com.yabar.backend.repository.ProductoRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // PUBLICO: usado por la landing para mostrar el catalogo
    @GetMapping
    public List<Producto> listarActivos() {
        return productoRepository.findByActivoTrue();
    }

    // PROTEGIDO (requiere JWT): usado por el panel admin, incluye inactivos
    @GetMapping("/admin/todos")
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    @PostMapping("/admin")
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto producto) {
        producto.setId(null); // evita que manden un id y sobrescriban algo existente
        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @Valid @RequestBody Producto datos) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setNombre(datos.getNombre());
                    producto.setCategoria(datos.getCategoria());
                    producto.setPrecio(datos.getPrecio());
                    producto.setUnidad(datos.getUnidad());
                    producto.setDescripcion(datos.getDescripcion());
                    producto.setImagenUrl(datos.getImagenUrl());
                    producto.setActivo(datos.getActivo());
                    return ResponseEntity.ok(productoRepository.save(producto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
