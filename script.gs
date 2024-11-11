function getConfig() {
  return {
    ignoredCourses: [], // Fill in the course IDs you want to ignore here
    groupEmail: "" // Set the email of the Google Chat group here
  }
}

function run() {
  const config = getConfig()
  try {
    const response = Classroom.Courses.list({courseStates:["ACTIVE"],pageSize:1000}); // 1000 is the limit
    var courses = response.courses;
    if (!courses || courses.length === 0) {
      console.error('No courses found.');
      return;
    }
    courses = courses.filter(a=>{return config.ignoredCourses.indexOf(a.id)==-1})
    const userProp = PropertiesService.getUserProperties()
    const ranBefore = userProp.getProperty("IMPERIAL_EDICT_SCRIPT_RAN_BEFORE")
    if (!ranBefore) {
      console.info("First run detected!\n\nYour courses:")
      userProp.setProperty("IMPERIAL_EDICT_SCRIPT_RAN_BEFORE",true)
      userProp.setProperty("IMPERIAL_EDICT_DATABASE","{}")
      console.info(courses.map(a=>`Name: ${a.name}, ID: ${a.id}`).join("\n"));
      console.info("\nMake sure to fill in the config variable if you want to ignore specific courses!")
      return
    }
    const secondRun = !userProp.getProperty("IMPERIAL_EDICT_SCRIPT_SECOND_RUN")
    if (secondRun) console.info("Second run detected! This run won't send any messages.")
    var tempDatabase = JSON.parse(userProp.getProperty("IMPERIAL_EDICT_DATABASE"))
    for (const course of courses) {
      var message = Classroom.Courses.Announcements.list(course.id).announcements
      if (!message) {
        tempDatabase[course.id] = "null"
        continue;
      }
      message = message[0]
      if ((tempDatabase[course.id]||"") == message.updateTime) continue;
      tempDatabase[course.id] = message.updateTime
      if (!secondRun) {
        const teacherName = Classroom.UserProfiles.get(message.creatorUserId).name.fullName
        const imperialEdict = `傳聖旨~
${teacherName}老師曰:
${message.text}
連結: ${message.alternateLink}`
        console.log(imperialEdict)
        GmailApp.sendEmail(config.groupEmail,`傳聖旨~ ${message.updateTime}`,imperialEdict)
      }
    }
    if (secondRun) userProp.setProperty("IMPERIAL_EDICT_SCRIPT_SECOND_RUN",true)
    userProp.setProperty("IMPERIAL_EDICT_DATABASE",JSON.stringify(tempDatabase))
  } catch (err) {
    console.error('Failed with error %s', err.message);
  }
}