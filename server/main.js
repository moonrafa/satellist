import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { TasksCollection } from '/imports/db/TasksCollection'
import '../imports/api/TasksMethods'
import '../imports/api/TasksPublications'

require('dotenv').config()

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date()
  })

const SEED_USERNAME = 'moonrafa'
const SEED_PASSWORD = 'password'

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD
    })
  }
  ServiceConfiguration.configurations.upsert(
    { service: 'github' },
    {
      $set: {
        loginStyle: 'popup',
        clientId: process.env.CLIENT_ID,
        secret: process.env.SECRET
      }
    }
  )

  const user = Accounts.findUserByUsername(SEED_USERNAME)

  if (TasksCollection.find().count() === 0) {
    ;[
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(insertTask, user)
  }
})
