import pymongo
import csv
from datetime import datetime

from bson import ObjectId

# Grab Database and Collections
myClient = pymongo.MongoClient(
    'mongodb+srv://dbUser:dbPassword@cluster0-1o2pd.gcp.mongodb.net/test?retryWrites=true&w=majority')
myDb = myClient["database"]
logs = myDb["logs"]
participants = myDb["progress"]
userArray = []

# User class representing participant's stats
class User:
    def __init__(self, Id, eventStart, eventEnd, pwType, totalLogins, succLogins, failedLogins,
                 totalSecondsSuc, totalSecondsFail, totalSeconds, testFailCount):
        self.id = Id
        self.eventStart = eventStart
        self.eventEnd = eventEnd
        self.pwType = pwType
        self.totalLogins = totalLogins
        self.succLogins = succLogins
        self.failedLogins = failedLogins
        self.totalSecondsSuc = totalSecondsSuc
        self.totalSecondsFail = totalSecondsFail
        self.totalSeconds = totalSeconds
        self.testFailCount = testFailCount

    def toCsvRow(self):
        return [self.id, self.pwType, str(self.totalLogins), str(self.succLogins), str(self.failedLogins),
                str(self.getAvgLoginTimeSuc()), str(self.getAvgLoginTimeFail())]

    # Gets the average login time from successful logins
    def getAvgLoginTimeSuc(self):
        if self.succLogins == 0:
            return 0.0
        return round(float(self.totalSecondsSuc / self.succLogins), 2)

    # Gets the average login time from successful invalidly
    def getAvgLoginTimeFail(self):
        if self.failedLogins == 0:
            return 0.0
        return round(float(self.totalSecondsFail / self.failedLogins), 2)


# Calculates the time between two dates
# eventStart - Start date
# eventEnd - End date
def calcTimeBetweenDates(eventStart, eventEnd):
    finalTime = eventEnd - eventStart
    return round(float(finalTime.total_seconds()), 2)


# Reads the csv file and collects the data row by row
# csvFile - the csv file
def readFromDatabase():
    for log in logs.find():
        # When the user opens the login
        if log['eventAndDetails'] == "TEST_SHOW":
            if len(userArray) == 0:
                userArray.append(User(log['progressId'], datetime.fromtimestamp(int(log['time']) / 1000), None,
                                      log['scheme'], 0, 0, 0, 0, 0, 0, 0))
                continue
            check = 0
            # Grab the correct User and change the start time
            for i in range(len(userArray)):
                if userArray[i].id == log['progressId']:
                    userArray[i].eventStart = datetime.fromtimestamp(int(log['time']) / 1000)
                    userArray[i].testFailCount = 0
                    check = 1
                    break
            # If could not find user, add him
            if check == 0:
                userArray.append(User(log['progressId'], datetime.fromtimestamp(int(log['time']) / 1000), None,
                                      log['scheme'], 0, 0, 0, 0, 0, 0, 0))
                continue
            else:
                continue

        # User attempts final password attempt (out of 3 tries)
        if log['eventAndDetails'] == "TEST_FAIL" or log['eventAndDetails'] == "TEST_PASS":
            for user in userArray:
                # Grab the correct User
                if user.id == log['progressId']:
                    # Ensure there is a start date
                    if user.eventStart is not None:
                        # If its a fail and on its third attempt
                        if log['eventAndDetails'] == "TEST_FAIL":
                            if user.testFailCount < 2:
                                user.testFailCount += 1
                                break
                        user.testFailCount = 0
                        user.eventEnd = datetime.fromtimestamp(int(log['time']) / 1000)
                        user.totalLogins += 1
                        timeBetweenDates = calcTimeBetweenDates(user.eventStart, user.eventEnd)
                        user.totalSeconds += calcTimeBetweenDates(user.eventStart, user.eventEnd)
                        if log['eventAndDetails'] == "TEST_FAIL":
                            user.failedLogins += 1
                            user.totalSecondsFail += timeBetweenDates
                        else:
                            user.succLogins += 1
                            user.totalSecondsSuc += timeBetweenDates


# Writes to a csv file each user collected in userArray
# csvFile - the csv file
def writeCsv(csvFile):
    for participant in participants.find():
        for user in userArray:
            if participant['_id'] == user.id:
                user.id = participant['userName'][11:]
    sortedUsers = []
    for i in range(15):
        for user in userArray:
            if int(user.id) == i:
                sortedUsers.append(user)
                break

    # Write to Csv
    with open(csvFile, mode='w') as combinedFiles:
        combinedFilesWriter = csv.writer(combinedFiles, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL,
                                         lineterminator='\n')
        combinedFilesWriter.writerow(
            ['participant', 'pw scheme', 'total logins', "total valid logins", "total fail logins",
             "avg time valid login", "avg time failed login"])
        for user in sortedUsers:
            combinedFilesWriter.writerow(user.toCsvRow())


def main():
    readFromDatabase()
    writeCsv("finalData.csv")
    print("csv file: finalData.csv has been created")


main()
