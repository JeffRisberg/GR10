class UrlMappings {

  static mappings = {
    "/todosAPI"(controller: "todosAPI") {
      action = [GET: "list", POST: "save"]
    }

    "/todosAPI/$id"(controller: "todosAPI") {
      action = [GET: "show", PUT: "update", DELETE: "delete"]

      constraints { id(matches: /\d+/) }
    }

    "/todoCategoriesAPI"(controller: "todoCategoriesAPI") {
      action = [GET: "list"]
    }

    "/$controller/$action?/$id?"{ constraints {
        // apply constraints here
      } }

    "/"(view:"/index")
    "500"(view:'/error')
  }
}
