import TenhouDecoder

from os import listdir
from os.path import isfile, join

path = "./logs"
onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
k = len(onlyfiles)

for i, f in enumerate(onlyfiles):
    game = TenhouDecoder.Game(lang='DEFAULT', suppress_draws=False)
    
    with open(join(path, f), "r") as file:
        s = file.read()
        code = f.split(".")[0]
        rounds = game.decode(s, code)
        
    if not (i+1)%250:
        print(f"{i+1}/{k} complete")