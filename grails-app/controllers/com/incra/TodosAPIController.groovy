package com.incra

import grails.converters.JSON

/**
 * Handles AJAX requests from the backbone.js front-end
 * 
 * @author Jeffrey Risberg
 * @since December 2012
 */
class TodosAPIController {

  TodoService todoService

  def index = {
    println "index"
    List<Todo> allTodos = todoService.getAll()
    render( allTodos as JSON )
  }

  def save = {
    println "save"
    def todo = new Todo(request.JSON)
    render( todo.save() as JSON )
  }

  def show = {
    println "show " + params.id
    def todo = Todo.findById(params.id)
    render(todo as JSON );
  }

  def delete = {
    println "delete " + params.id
    def todo = Todo.findById(params.id)
    todo?.delete()
    render(todo as JSON );
  }

  def update = {
    println "update " + params.id
    def todo = Todo.findById(params.id)
    bindData(todo, request.JSON)
    render(todo.save() as JSON )
  }
}
