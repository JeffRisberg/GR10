package com.incra

class TodoCategory {

  String name
  String bgColor

  static constraints = {
    name(nullable: false, unique: true)
  }
}
