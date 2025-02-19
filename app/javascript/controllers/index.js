// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import HelloController from "./hello_controller"
import DraggableController from "./draggable_controller"
import ClockController from "./clock_controller"
import StartMenuController from "./start_menu_controller"
import WindowController from "./window_controller"
import CalculatorController from "./calculator_controller"
import TerminalController from "./terminal_controller"
import CalendarController from "./calendar_controller"

application.register("hello", HelloController)
application.register("draggable", DraggableController)
application.register("clock", ClockController)
application.register("start-menu", StartMenuController)
application.register("window", WindowController)
application.register("calculator", CalculatorController)
application.register("terminal", TerminalController)
application.register("calendar", CalendarController)
