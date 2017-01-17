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

<p>Pour avoir le Stream et les commandes il suffit d'ouvrir la page "<b><i>index.html</i></b>" ou de vous connecter sur l'adresse Ip de votre raspberry via votre tablette ou téléphone. <i>Prennez soin de modifier le code des fichiers "<b><i>index.html</i></b>", "<b><i>CrossPi.py</i></b>" & "<b><i>CrossPi.js</i></b>" afin de rentrer l'adresse Ip fixe que vous avez donné à votre raspberry</i></p>

<h3>Commandes</h3>

![ CrossPi ](https://github.com/gaudinjeremy/CrossPi/blob/master/_Photos/IMG_4111.PNG)

