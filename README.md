# bitburner-scripts

My scripts for the [Bitburner](https://danielyxie.github.io/bitburner/) idle game.

# Usage

The first step is to download the installer on your Home computer.

```
# Download the installer
wget https://raw.githubusercontent.com/maximeaubaret/bitburner-scripts/master/installer.js installer.js
```

Then, simply execute the installer.

```
# Execute the installer
run installer.js
```

This will download all the scripts and their dependencies.

# Development

To work on the scripts, it's easier to use a local webserver and use [ngrok](https://ngrok.com/) to expose it.

> Why ngrok? Because since we're playing the game on HTTPS, the browser won't allow us to download anything from a server which is not HTTPS. We could setup our own HTTPS server, but this too much work.

To start the webserver, simply use:

```
# Start the webserver
yarn serve
```

This will serve all the files in the current directly on an http server running on port 44757.

Then, to launch ngrok:

```
# Start ngrok (you have to install it beforehand)
yarn ngrok
```

And look for `Forwarding` in the console. Next to it you should see a url that looks like ` https://67a8724c2703.ngrok.io`. This is the endpoint we'll use.

Finally, to install the scripts from our local webserver, we simply provide the webserver url to our installer like so:

```
# [In the game] Install/update our scripts hosted on our local webserver
run installer.js https://67a8724c2703.ngrok.io
```

That's it! To make it easier on us, what I like to do is setup two aliases: one to update the installer (in case we add more scripts to our collection), and one to re-install the script.

```
alias update="run installer.js https://67a8724c2703.ngrok.io"
alias updateInstaller="wget https://67a8724c2703.ngrok.io/installer.js installer.js"
```
