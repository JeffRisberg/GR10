import com.incra.TodoCategory

class BootStrap {

  def init = { servletContext ->

    TodoCategory category

    category = new TodoCategory(name: "Professional", bgColor: "blue")
    category.save()
    category = new TodoCategory(name: "Personal", bgColor: "green")
    category.save()
    category = new TodoCategory(name: "Unspecified", bgColor: "white")
    category.save()
  }
  def destroy = {
  }
}
