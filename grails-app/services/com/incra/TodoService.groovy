package com.incra

/**
 * Business logic related to todo management is being migrated into this service.
 * 
 * @author Jeffrey Risberg
 * @since December 2012
 */
class TodoService {

  List<Todo> getAll() {
    Todo.findAll()
  }
}
