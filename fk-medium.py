class F:
    def __init__(s):
        s.r=["SWE","AIEng","Prompt","Researcher","Writer"]
        s.m="Optimize life via tech+creativity"
        s.s=["FullStack","AIExp","Tools","Stories"]
        s.t=["AI","Software","RemoteWork","MentalHealth","Relationships","Faith"]
        s.l={"Web":"farhankabir.me","LinkedIn":"linkedin.com/in/farhankabir133","Gumroad":"gumroad.com/farhankabir"}

    def go(s): return f"Roles:{'|'.join(s.r)} | Stack:{'|'.join(s.s)} | Topics:{'|'.join(s.t)} | Mission:{s.m} | Links:{' | '.join(f'{k}:{v}' for k,v in s.l.items())}"

F().go()
