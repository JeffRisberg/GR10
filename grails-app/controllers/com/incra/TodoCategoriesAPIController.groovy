package com.incra

import grails.converters.JSON

/**
 * Handles AJAX requests from the backbone.js front-end
 * 
 * @author Jeffrey Risberg
 * @since December 2012
 */
class TodoCategoriesAPIController {

  def index = {
    println "index"
    def r = TodoCategory.findAll()
    println r
    render( TodoCategory.findAll() as JSON )
  }
}
