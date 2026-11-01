import gdown,sys,collections
folders=dict(a.split("=",1) for a in sys.argv[1:])
for name,fid in folders.items():
    try:
        fs=gdown.download_folder(id=fid,skip_download=True,quiet=True)
        ext=collections.Counter(f.path.rsplit('.',1)[-1].lower() for f in fs)
        sub=collections.Counter(f.path.split('/')[0] for f in fs if '/' in f.path)
        print(f"{name}: {len(fs)} files {dict(ext)} subdirs={dict(sub)}")
    except Exception as e: print(f"{name}: ERROR {str(e)[:150]}")
