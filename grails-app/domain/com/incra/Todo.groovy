package com.incra

class Todo {

  boolean done
  int seqNum
  String message

  static constraints = {
    message(nullable: false, empty: false)
  }
}
