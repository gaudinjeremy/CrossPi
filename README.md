# CrossPi
Un dérivé du GoPiGo de chez DEXTERINDUSTRIES à l'aide d'un peu de patiente et d'un ancienne boite de méccanos.

![ CrossPi ](https://github.com/gaudinjeremy/CrossPi/blob/master/_Photos/IMG_4106.JPG)

<h2>Pré requis</h2>
<h3>Hardware</h3>
<ul>
<li>Le kit GoPiGo ou la carte mère</li>
<li>Un Raspberry Pi (A/B/B+)</li>
<li>Une carte mémoire</li>
<li>Un dongle Wifi selon les Raspberry</li>
</ul>

<h3>Software</h3>
<ul>
<li>Installer un serveur Apache ou Nginx sur le Raspberry</li>
<li>Installer la librairie du GoPiGo <a href="https://github.com/DexterInd/GoPiGo" target="_blank">Lien</a></li>
<li>Installer le script pour le streaming video <a href="https://github.com/DexterInd/GoPiGo/blob/master/Software/Python/Examples/Browser_Streaming_Robot/browser_stream_setup.sh" target="_blank">Lien</a></li>
<li>Donner une Ip fixe à votre raspberry</li>
</ul>

<h3>Utilisation</h3>
<p>L'ensemble des commandes fonctionnent via un Websocket <a href="https://github.com/dpallot/simple-websocket-server" target="_blank">Source</a>.</p>

Pour lancer le webSocket il faut executer la commande suivante :

<pre>sudo python /home/pi/Desktop/CrossPi/py/CrossPi.py</pre>

<p><i>(Bien sur la commande peux être executé automatiquement au lancement du Raspberry)</i></p>

<p>Pour avoir le Stream et les commandes il suffit d'ouvrir la page "<b><i>index.html</i></b>" ou de vous connecter sur l'adresse Ip de votre Raspberry via votre tablette ou téléphone. <i>Prennez soin de modifier le code des fichiers "<b><i>index.html</i></b>", "<b><i>CrossPi.py</i></b>" & "<b><i>CrossPi.js</i></b>" afin de rentrer l'adresse Ip fixe que vous avez donné à votre raspberry</i></p>

<p>Toutes les informations sur l'état du Rapsberry et des capteurs sont envoyés via un thread Python sur le WebSocket "<b><i>class System</i></b>" dans le fichier "<b><i>CrossPi.py</i></b>".

<h3>Commandes</h3>

![ CrossPi ](https://github.com/gaudinjeremy/CrossPi/blob/master/_Photos/IMG_4112.PNG)

<ul>
<li>L'ampoule en haut à gauche permet d'allumer ou d'éteindre les leds</li>
<li>La barre transparente en haut change en fonction de la proximité capté par le capteur ultrason</li>
<li>Le Joystick de gauche permet d'ajuster la vitesse</li>
<li>Le Joystick de droite permet d'ajuster la direction</li>
<li>L'icone de batterie affiche le voltage de l'alimentation <i>(Recommandé entre 9V et 15V)</i></li>
<li>Le compteur de gauche représente la température du Raspberry</li>
<li>Le compteur de droite représente la vitesse des moteurs <i>(Plage de fonctionnement 0-255)</i></li>
<li>L'icone à droite du compteur de vitesse représente en % l'utilisation du CPU du Raspberry</li>
</ul>

<h3>Évolutions</h3>
<ul>
<li>Pilot automatique activable et désactivable via un Thread Python</li>
<li>Ajoute d'un bouton permettant d'orienter le servo-moteur depuis l'interface</li>
</ul>

<h3>Quelques photos</h3>
