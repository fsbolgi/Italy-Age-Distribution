import random
import os

#for all files
for data_file in os.listdir("../Git/Data/Female"):
    print data_file
    f = open("../Git/Data/Female/" + data_file, 'r')
    filedata = f.read()
    f.close()

    newdata = filedata.replace("None", "0")

    f = open("../Git/Data/Female/" + data_file, 'w')
    f.write(newdata)
    f.close()