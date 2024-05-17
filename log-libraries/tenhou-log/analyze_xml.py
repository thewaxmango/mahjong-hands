import TenhouDecoder

from os import listdir
from os.path import isfile, join

path = "./logs"
onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]

for f in onlyfiles:
    game = TenhouDecoder.Game(lang='DEFAULT', suppress_draws=False)
    
    with open(join(path, f), "r") as file:
        s = file.read()
        code = f.split(".")[0]
        rounds = game.decode(s, code)