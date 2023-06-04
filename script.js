$(function () {
  // Display the current date in the header of the page
  var currentDayEl = $("#currentDay");
  currentDayEl.text(dayjs().format("dddd, MMMM D, YYYY"));

  // Create an array of objects to represent the time blocks from 9 AM to 10 PM
  var timeBlocks = [];
  for (var i = 9; i <= 22; i++) {
    var hour = i;
    var amPm = hour < 12 ? "AM" : "PM";
    hour = hour > 12 ? hour - 12 : hour;
    timeBlocks.push({ id: "hour-" + i, hour: hour, amPm: amPm, description: "" });
  }

  // Generate the time blocks using the timeBlocks array
  var timeBlocksContainer = $("#time-blocks-container");
  for (var i = 0; i < timeBlocks.length; i++) {
    var timeBlock = timeBlocks[i];

    // Create time block
    var timeBlockEl = $("<div>")
      .attr("id", timeBlock.id)
      .addClass("row time-block")
      .addClass(getTimeBlockClass(timeBlock.hour));

    var hourEl = $("<div>")
      .addClass("col-2 col-md-1 hour text-center py-3")
      .text(timeBlock.hour + timeBlock.amPm);

    var descriptionEl = $("<textarea>")
      .addClass("col-8 col-md-10 description")
      .attr("rows", "3")
      .val(timeBlock.description);

    var saveBtnEl = $("<button>")
      .addClass("btn saveBtn col-2 col-md-1")
      .attr("aria-label", "save")
      .html('<i class="fas fa-save" aria-hidden="true"></i>');

    timeBlockEl.append(hourEl, descriptionEl, saveBtnEl);

    timeBlocksContainer.append(timeBlockEl);
  }

  // Add a listener for save button
  $(".saveBtn").on("click", function () {
    var timeBlockId = $(this).parent().attr("id");
    var description = $(this).siblings(".description").val();
    localStorage.setItem(timeBlockId, description);
  });

  // Apply the past, present, or future class to each time block
  function updateTimBlockClasses() {
    var currentHour = dayjs().hour();
    $(".time-block").each(function () {
      var timeBlockHour = parseInt($(this).attr("id").split("-")[1]);
      $(this).removeClass("past present future").addClass(getTimeBlockClass(timeBlockHour, currentHour));
    });
  }

  updateTimBlockClasses();

  // Update the time block classes every minute to reflect the current time
  setInterval(updateTimBlockClasses, 60000);

  // Get the CSS class for a time block based on the current hour and the time block hour
  function getTimeBlockClass(timeBlockHour, currentHour) {
    if (timeBlockHour < currentHour) {
      return "past";
    } else if (timeBlockHour === currentHour) {
      return "present";
    } else {
      return "future";
    }
  }

  // Get any user input that was saved in localStorage
  function loadSavedDescriptions() {
    $(".time-block").each(function () {
      var timeBlockId = $(this).attr("id");
      var description = localStorage.getItem(timeBlockId);
      $(this).find(".description").val(description);
    });
  }

  // Load the saved descriptions when the page is loaded
  loadSavedDescriptions();
});
