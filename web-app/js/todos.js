
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

    // this sets up the marker strings needed for interpolating {{ }} and evaluation {! !}
    _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g,
        evaluate : /\{!(.+?)!\}/g
    };

  // Todo Models
  // -----------
  alert("creating models");
  // Todo model has attributes `message`, `seqNum`, `done`
  window.Todo = Backbone.Model.extend({

    // Default attributes for a todo item.
    defaults: function() {
      return {
        done:  false,
        seqNum: Todos.nextSeqNum()
      };
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });
  
  // 'TodoCategory' model has attributes `name`, `bgColor`
  window.TodoCategory = Backbone.Model.extend({
  });

  // Todo Collections
  // ----------------
  alert("creating collections");
  // List of Todo's
  window.TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Todo,

    url: '/GR10/todosAPI',

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next seq number for new items.
    nextSeqNum: function() {
      if (!this.length) return 1;
      return this.last().get('seqNum') + 1;
    },

    // Todos are sorted by their original insertion seq num.
    comparator: function(todo) {
      return todo.get('seqNum');
    }

  });

  // Create our global collection of **Todos**.
  window.Todos = new TodoList;

  // List of TodoCategories
  window.TodoCategoriesList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: TodoCategory,

    url: '/GR10/todoCategoriesAPI',
  });
    
  // Create our global collection of **TodoCategories**.
  window.TodoCategories = new TodoCategoriesList;
  
  // Todo Item View
  // --------------

  alert("creating TodoView view");
  window.TodoView = Backbone.View.extend({

    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .check"              : "toggleDone",
      "dblclick div.todo-message" : "edit",
      "click span.todo-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter"
    },

    // The TodoView listens for changes to its model, re-rendering.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the todo item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setMessage();
      return this;
    },

    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the todo item.
    setMessage: function() {
      var message = this.model.get('message');
      this.$('.todo-message').text(message);
      this.input = this.$('.todo-input');
      this.input.bind('blur', _.bind(this.close, this)).val(message);
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      this.model.save({message: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove this view from the DOM.
    remove: function() {
      $(this.el).remove();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }
  });

  // Todo Category View
  // ------------------

  alert("creating TodoCategoryView view");
  window.TodoCategoryView = Backbone.View.extend({

    tagName: "li",

    // Cache the template function for a single item.
    template: _.template($('#category-template').html()),

    events: {
      "click .todoCategory-name a": "selectCategory"
    },
    
    // Re-render the contents of the todoCategory.
    render: function() {
      $(this.el).append(this.template(this.model.toJSON()));
      return this;
    },
    
    selectCategory: function() {      
      alert(this.model.get('name'));
    },
  });
  
  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  alert("creating AppView view");
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "keyup #new-todo":     "showTooltip",
      "click .todo-clear a": "clearCompleted"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed.
    initialize: function() {
      this.input = this.$("#new-todo");

      Todos.bind('add',   this.addOne, this);
      Todos.bind('reset', this.addAll, this);
      Todos.bind('all',   this.render, this);
     
      TodoCategories.bind('reset', this.addAllCategories, this);
      
      Todos.fetch();
      TodoCategories.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      this.$('#todo-stats').html(this.statsTemplate({
        total:      Todos.length,
        done:       Todos.done().length,
        remaining:  Todos.remaining().length
      }));
      
      $('#todoCategories-list').empty();
      
      TodoCategories.each(this.addCategory);
    },
 
    // Add a single todo category to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addCategory: function(todoCategory) {
      var view = new TodoCategoryView({model: todoCategory});
      $("#todoCategories-list").append(view.render().el);
    },
    
    // Add all items in the **Todos** collection at once.
    addAllCategories: function() {
      TodoCategories.each(this.addCategory);
    },
    
    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {    
      var view = new TodoView({model: todo});
      $("#todo-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Todos.each(this.addOne);
    },

    // If you hit return in the main input field, and there is a message to save,
    // create new **Todo** model persisting it to *localStorage*.
    createOnEnter: function(e) {
      var message = this.input.val();
      if (!message || e.keyCode != 13) return;
      Todos.create({message: message});
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.destroy(); });
      return false;
    },

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    }
  });
  
  // Finally, we kick things off by creating the **App**.
  alert("create an AppView instance");
  window.App = new AppView;
  
  alert("end of todos.js");
});
