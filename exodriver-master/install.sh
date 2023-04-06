#! /bin/bash

RULES=90-labjack.rules
OLD_RULES=10-labjack.rules
RULES_DEST_PRIMARY=/lib/udev/rules.d
RULES_DEST_ALTERNATE=/etc/udev/rules.d
SUPPORT_EMAIL=support@labjack.com
TRUE=1
FALSE=0
IS_SUCCESS=$TRUE
# Assume these are unneeded until otherwise
NEED_RECONNECT=$FALSE
NEED_RESTART=$FALSE
NO_RULES=$FALSE
NO_RULES_ERR=2

go ()
{
	$@
	ret=$?
	if [ $ret -ne 0 ]; then
		echo "Error, please make sure you are running this script as:"
		echo "  $ sudo $0"
		echo "If you are still having problems, please contact LabJack support: <$SUPPORT_EMAIL>"
		exit $ret
	fi
}

success ()
{
	e=0
	if [ $IS_SUCCESS -eq $TRUE ]; then
		echo "Install finished. Thank you for choosing LabJack."
	fi
	if [ $NEED_RECONNECT -eq $TRUE ]; then
		echo "If you have any LabJack devices connected, please disconnect and reconnect them now for device rule changes to take effect."
	fi
	if [ $NO_RULES -eq $TRUE ]; then
		echo "No udev rules directory found. Searched for $RULES_DEST_PRIMARY, $RULES_DEST_ALTERNATE."
		echo "Please copy $RULES to your device rules directory and reload the rules or contact LabJack support for assistance: <$SUPPORT_EMAIL>"
		let e=e+$NO_RULES_ERR
	fi
	if [ $NEED_RESTART -eq $TRUE ]; then
		echo "Please manually restart the device rules or restart your computer now."
	fi
	exit $e
}

##############################
# Exodriver make and install #
##############################
go cd liblabjackusb/

echo "Making.."
go make clean
go make

echo "Installing.."
go make install

# Mac OS doesn't need rules config
if [ `uname -s` == "Darwin" ]; then
	success
fi

go cd ../

#################
# LabJack Rules #
#################
rm -f $RULES_DEST_PRIMARY/$OLD_RULES
rm -f $RULES_DEST_ALTERNATE/$OLD_RULES

if [ -d $RULES_DEST_PRIMARY ]; then
	RULES_DEST=$RULES_DEST_PRIMARY

	OLD_FILE_TO_REMOVE=$RULES_DEST_ALTERNATE/$RULES
	if [ -f $OLD_FILE_TO_REMOVE ]; then
		rm $OLD_FILE_TO_REMOVE
	fi
elif [ -d $RULES_DEST_ALTERNATE ]; then
	RULES_DEST=$RULES_DEST_ALTERNATE
else
	NO_RULES=$TRUE
fi

if [ $NO_RULES -ne $TRUE ]; then
	echo "Adding $RULES to $RULES_DEST.."
	go cp -f $RULES $RULES_DEST
	NEED_RECONNECT=$TRUE
fi

#####################
# Restart the Rules #
#####################
echo -n "Restarting the rules.."
udevadm control --reload-rules 2> /dev/null
ret=$?
if [ $ret -ne 0 ]; then
	udevadm control --reload_rules 2> /dev/null
	ret=$?
fi
if [ $ret -ne 0 ]; then
	/etc/init.d/udev-post reload 2> /dev/null
	ret=$?
fi
if [ $ret -ne 0 ]; then
	udevstart 2> /dev/null
	ret=$?
fi
if [ $ret -ne 0 ]; then
	NEED_RESTART=$TRUE
	echo " could not restart the rules."
else
	echo # Finishes previous echo -n
fi

success
