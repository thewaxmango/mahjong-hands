# TANYAO (All Simples)
module.exports =
    name: 'tanyao'
    exclude: ['yakuhai', 'chanta', 'junchan', 'itsu', 'honitsu', 'honroutou', 'shou sangen']
    desc: "Hand with no terminals and honours"
    test: ({ hand }) ->
        for set in hand.sets
            return if set.isHonor or set.isTerminal
        return if hand.pair.isHonor or hand.pair.isTerminal
        return 1
