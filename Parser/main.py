from parsers import gios, airly, imgw

filetype = 0
while not 1 <= filetype <= 3:
    print("Enter number of source of data you want to insert into database: \n"
          "1. Gioś \n"
          "2. Airly \n"
          "3. IMGW \n")
    filetype = int(input())

print("Enter absolute path of file using double backslashes: \n")
filepath = input()

if filetype == 1:
    gios(filepath)

elif filetype == 2:
    airly(filepath)

elif filetype == 3:
    datatype = 0
    while not 1 <= datatype <= 4:
        print("Enter number of type of data you want to insert into database: \n"
              "1. Temperature (B00300S) \n"
              "2. Wind speed (B00702A) \n"
              "3. Wind direction (B00202A) \n"
              "4. Humidity (B00802A) \n")
        datatype = int(input())
        if datatype == 1:
            type = 7
        elif datatype == 2:
            type = 11
        elif datatype == 3:
            type = 10
        elif datatype == 4:
            type = 8
    imgw(filepath, type)

