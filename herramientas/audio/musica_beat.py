# Pista propia de Tecnocríticos con beat (síntesis pura, sin muestras de terceros). 118 BPM.
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt
SR=48000; DUR=float(sys.argv[1]); BPM=118; b=60/BPM; bar=4*b
n=int(DUR*SR)+SR; rng=np.random.default_rng(11)
def hz(m): return 440*2**((m-69)/12)
def filt(x,f,t='low',o=2): return sosfilt(butter(o,f,btype=t,fs=SR,output='sos'),x)
def saw(f,d,det=0.0):
    tt=np.arange(int(d*SR))/SR; x=np.zeros_like(tt); fr=f*(1+det)
    for k in range(1,int(min(40,18000/fr))+1): x+=np.sin(2*np.pi*fr*k*tt+rng.random()*0.3)/k
    return x*0.6
def env(m,a,d,s,r,dur):
    tt=np.arange(m)/SR; e=np.where(tt<a,tt/a,s+(1-s)*np.exp(-(tt-a)/d)); rel=int(r*SR)
    on=int(dur*SR)
    if on<m: e[on:]*=np.exp(-np.arange(m-on)/SR/r)
    return e
pistas={k:np.zeros(n) for k in ['kick','clap','hat','bajo','acordes','pad','lead']}
def poner(k,x,ini):
    i=int(ini*SR); j=min(n,i+len(x))
    if 0<=i<n: pistas[k][i:j]+=x[:j-i]
# sonidos base
tt=np.arange(int(0.35*SR))/SR
KICK=np.sin(2*np.pi*np.cumsum(48+110*np.exp(-tt*38))/SR)*np.exp(-tt*9)
KICK[:200]+=np.linspace(0.6,0,200)*rng.standard_normal(200)*0.3
KICK=np.tanh(KICK*1.6)
m=int(0.22*SR); tt=np.arange(m)/SR; ru=filt(rng.standard_normal(m),[900,3500],'band')
CLAP=ru*(np.exp(-tt*30)+0.6*np.exp(-np.maximum(tt-0.012,0)*40)*(tt>0.012)+0.5*np.exp(-np.maximum(tt-0.024,0)*25)*(tt>0.024))
CLAP=CLAP/np.abs(CLAP).max()
m=int(0.06*SR); tt=np.arange(m)/SR; HAT=filt(rng.standard_normal(m),7000,'high')*np.exp(-tt*70); HAT/=np.abs(HAT).max()
m=int(0.25*SR); tt=np.arange(m)/SR; OHAT=filt(rng.standard_normal(m),6000,'high')*np.exp(-tt*14); OHAT/=np.abs(OHAT).max()
acordes=[[57,60,64,67],[53,57,60,64],[48,52,55,60],[55,59,62,67]]  # Am7 Fmaj7 C G
raices=[45,41,48,43]
cache={}
def pluck(m,d):
    key=(m,round(d,3))
    if key not in cache:
        x=sum(saw(hz(m),d,det) for det in (-0.006,0,0.006))
        e=env(len(x),0.004,0.18,0.15,0.08,d*0.8)
        # filtro que se abre y cierra (dos bandas para simular envolvente)
        bright=filt(x,5200); dark=filt(x,1400); tt=np.arange(len(x))/SR; mezcla=np.exp(-tt*9)
        cache[key]=(bright*mezcla+dark*(1-mezcla))*e
    return cache[key]
nb=int(np.ceil(DUR/bar))+1
ritmo_acordes=[0,0.75,1.5,2.5,3.25]   # en tiempos: síncopa
melodia=[None,76,None,79,76,None,74,72, None,72,None,74,76,None,79,None]
for k in range(nb):
    ini=k*bar; ac=acordes[k%4]; r=raices[k%4]; seccion=(k//8)%4
    intro = k<2; final = ini>DUR-2*bar
    # bombo cuatro por compás
    if not intro:
        for s in range(4): poner('kick',KICK,ini+s*b)
    else:
        poner('kick',KICK,ini)
    if not intro:
        for s in (1,3): poner('clap',CLAP*0.8,ini+s*b)
    for s in range(16):
        v=[0.55,0.25,0.4,0.25][s%4]*(0.85+0.3*rng.random())
        if not intro or s%2==0: poner('hat',HAT*v,ini+s*b/4+0.004*rng.random())
    if not intro:
        for s in range(4): poner('hat',OHAT*0.35,ini+s*b+b/2)
    # bajo: corcheas en contratiempo con octava
    for s in range(8):
        if s%2==1 or s==0:
            mm=r-12+(12 if s in (3,7) else 0)
            x=filt(saw(hz(mm),b*0.45),900)*env(int(b*0.45*SR),0.005,0.12,0.6,0.04,b*0.4)
            poner('bajo',x*0.9,ini+s*b/2)
    # acordes pluck sincopados
    for pos in ritmo_acordes:
        for mm in ac: poner('acordes',pluck(mm+12,b*0.7)*0.22,ini+pos*b)
    # pad
    for mm in ac:
        x=filt(sum(saw(hz(mm),bar+0.3,dd) for dd in (-0.004,0.004)),1200)*env(int((bar+0.3)*SR),0.4,2,0.7,0.3,bar)
        poner('pad',x*0.06,ini)
    # melodía en secciones 2 y 4 (cada 8 compases alterna)
    if seccion in (1,3) and not final:
        for s,mm in enumerate(melodia):
            if mm: 
                x=pluck(mm,b*0.45)*0.5
                poner('lead',x,ini+s*b/4)
# sidechain: bombeo con el bombo
pump=np.ones(n); m=int(0.3*SR); curva=1-0.75*np.exp(-np.arange(m)/SR*14)
for k in range(nb):
    for s in range(4):
        if k>=2:
            i=int((k*bar+s*b)*SR); j=min(n,i+m)
            if i<n: pump[i:j]=np.minimum(pump[i:j],curva[:j-i])
mix=(pistas['kick']*0.9+pistas['clap']*0.32+pistas['hat']*0.09+
     (pistas['bajo']*0.55+pistas['acordes']*0.6+pistas['pad']+pistas['lead']*0.35)*pump)
mix=filt(mix,30,'high')
mix=np.tanh(mix*1.3)/np.tanh(1.3)
mix=mix[:int(DUR*SR)]
f=int(1.0*SR); mix[:f]*=np.linspace(0,1,f); g=int(3.5*SR); mix[-g:]*=np.linspace(1,0,g)
mix/=np.abs(mix).max()*1.1
L=mix; R=np.roll(mix,int(0.009*SR))*0.98+0.02*L
st=np.stack([L,R],1)
w=wave.open(sys.argv[2],"wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
