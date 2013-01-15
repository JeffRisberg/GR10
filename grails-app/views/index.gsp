<!DOCTYPE html>
<html>

  <head>
    <title>Backbone Demo: Todos</title>   
    <meta name="layout" content="main">
    <script type="text/javascript" src="<g:createLinkTo dir='js' file='todos.js' />" ></script>    
  </head>

  <body>

    <!-- Todo App Interface -->
    <div id="todoapp">

      <div class="title">
        <h1>Todos</h1>
      </div>

      <div class="content">

        <div id="todoCategories">
          <ul id="todoCategories-list" style="list-style-type: square"></ul>
        </div>

        <div id="create-todo">
          <input id="new-todo" placeholder="What needs to be done?" type="text" />
          <span class="ui-tooltip-top" style="display:none;">Press Enter to save this task</span>
        </div>

        <div id="todos">
          <ul id="todo-list"></ul>
        </div>

        <div id="todo-stats"></div>
      </div>
    </div>

    <!-- Templates -->

    <script type="text/template" id="item-template">
      <div class="todo {{ done ? 'done' : '' }}">
        <div class="display">
          <input class="check" type="checkbox" {{ done ? 'checked="checked"' : '' }} />
          <div class="todo-message"></div>
          <span class="todo-destroy"></span>
        </div>
        <div class="edit">
          <input class="todo-input" type="text" value="" />
        </div>
      </div>
    </script>

    <script type="text/template" id="stats-template">
      {! if (total) { !}
        <span class="todo-count">
          <span class="number">{{ remaining }}</span>
          <span class="word">{{ remaining == 1 ? 'item' : 'items' }}</span> left.
        </span>
      {! } !}
      {! if (done) { !}
        <span class="todo-clear">
          <a href="#">
            Clear <span class="number-done">{{ done }}</span>
            completed <span class="word-done">{{ done == 1 ? 'item' : 'items' }}</span>
          </a>
        </span>
      {! } !}
    </script>
    
    <script type="text/template" id="category-template">
      <div class="todoCategory-name">
        <a href="#">
        {{ name }} 
        </a>
      </div>
    </script>

  </body>

</html>