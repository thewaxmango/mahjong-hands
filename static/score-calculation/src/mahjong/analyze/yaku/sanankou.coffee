# SANANKOU (Three Concealed Pungs)
# --------------------------------
#
module.exports =
    name: 'sanankou'
    exclude: ['pinfu', 'iipeikou', 'ryanpeikou', 'sanshoku', 'itsu', 'chitoitsu']
    desc: """
        Hand with three concealed pungs/kongs. Note, the entire hand is not
        required to be concealed. """
    test: ({ hand }) ->
        count = 0
        for set in hand.sets
            continue unless set.isPon
            continue if set.isOpened
            continue if not hand.tsumo and hand.wait.set.id == set.id
            count++
        return unless count == 3
        return 2
