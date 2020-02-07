data = {}
def getdata():
    return data
def setdata(id,value):
    data[id] = value
    print(data)
def deletedata(id):
    del data[id]