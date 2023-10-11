def has_requirements():
    """this function will check if the microcontroller has the requirements to run the topology"""
    try: 
        # INSERT COMMANDS TO TRY REQUIREMENTS HERE:
        import ulab # check if ulab is installed
    except:
        print("FAIL")
        return
    print("PASS")
