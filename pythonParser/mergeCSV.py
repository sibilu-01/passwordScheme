import csv
from datetime import datetime

userArray = []
text21 = "text21.csv"
image21 = "imagept21.csv"


# Id - users ID
# eventStart - time user started to login (event start)
# eventEnd - time user finished (login successful/fail)
# pwType - type of password scheme
# totalLogin - number of total logins
# succLogins - number of successful logins
# failedLogins - number of failed logins
# totalSecondSuc - total time it took to finish logging in successfully
# totalSecondFail - total time it took to finish logging in invalidly
# totalSeconds - total seconds it took to finish logging in generally
# eventStartBackUp - used in only 3 instances where event start doesnt show in the csv file, grabs order inputPWD
class UserRow:
    def __init__(self, Id, eventStart, eventEnd, pwType, totalLogins, succLogins, failedLogins, totalSecondsSuc,
                 totalSecondsFail, totalSeconds, eventStartBackUp):
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
        self.eventStartBackUp = eventStartBackUp

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
    startDate = datetime.strptime(eventStart, '%Y-%m-%d  %H:%M:%S')
    endDate = datetime.strptime(eventEnd, '%Y-%m-%d  %H:%M:%S')
    finalTime = endDate - startDate
    return round(float(finalTime.total_seconds()), 2)


# Reads the csv file and collects the data row by row
# csvFile - the csv file
def readCsv(csvFile):
    with open(csvFile) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            # When the user opens the login
            if row[5] == "enter" and row[6] == "start":
                if len(userArray) == 0:
                    userArray.append(UserRow(row[1], row[0], None,
                                             csvFile[:-4], 0, 0, 0, 0, 0, 0, None))
                    continue
                check = 0
                # Grab the correct User and change the start time
                for i in range(len(userArray)):
                    if userArray[i].id == row[1]:
                        userArray[i].eventStart = row[0]
                        check = 1
                        break
                # If could not find user, add him
                if check == 0:
                    userArray.append(UserRow(row[1], row[0], None,
                                             csvFile[:-4], 0, 0, 0, 0, 0, 0, None))
                    continue
                else:
                    continue
            # (NO event start CASE) 3 cases where event start is missing
            # and the session for the user starts at event
            # order input Pwd
            if row[5] == "enter" and row[6] == "order inputPwd":
                # Grab the correct User and change the start time
                for i in range(len(userArray)):
                    if userArray[i].id == row[1]:
                        userArray[i].eventStartBackUp = row[0]
                        break
            # User tries to login in
            elif row[5] == "login":
                for user in userArray:
                    # Grab the correct User
                    if user.id == row[1]:
                        # Ensure there is a start date
                        if user.eventStart is not None:
                            user.eventEnd = row[0]
                            user.totalLogins += 1
                            # (NO event start CASE)
                            timeBetweenDates = calcTimeBetweenDates(user.eventStart, user.eventEnd)
                            if timeBetweenDates > 1000.0:
                                user.totalSeconds += calcTimeBetweenDates(user.eventStartBackUp, user.eventEnd)
                            else:
                                user.totalSeconds += calcTimeBetweenDates(user.eventStart, user.eventEnd)
                            if row[6] == "failure":
                                user.failedLogins += 1
                                # (NO event start CASE)
                                if timeBetweenDates > 1000.0:
                                    user.totalSecondsFail += calcTimeBetweenDates(user.eventStartBackUp,
                                                                                  user.eventEnd)
                                else:
                                    user.totalSecondsFail += timeBetweenDates
                            else:
                                user.succLogins += 1
                                # (NO event start CASE)
                                if timeBetweenDates > 1000.0:
                                    user.totalSecondsSuc += calcTimeBetweenDates(user.eventStartBackUp,
                                                                                 user.eventEnd)
                                else:
                                    user.totalSecondsSuc += timeBetweenDates
            else:
                continue


# Writes to a csv file each user collected in userArray
# csvFile - the csv file
def writeCsv(csvFile):
    with open(csvFile, mode='w') as combinedFiles:
        combinedFilesWriter = csv.writer(combinedFiles, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL,
                                         lineterminator='\n')
        combinedFilesWriter.writerow(
            ['userid', 'pw scheme', 'total logins', "total valid logins", "total fail logins", "avg time valid login",
             "avg time failed login"])
        for user in userArray:
            combinedFilesWriter.writerow(user.toCsvRow())


def main():
    readCsv(text21)
    readCsv(image21)
    writeCsv("combinedData.csv")
    print("csv file: combinedData.csv has been created")


main()
