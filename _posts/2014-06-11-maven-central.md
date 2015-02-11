---
layout: post
title: "Getting a jar on Maven Central: An Epic"
---

The documentation on how to submitting a jar to Maven Central is extremely difficult to find on Google. I [made this](https://gist.github.com/ronshapiro/9132c5bd1734e513daaa) to hopefully be helpful to others - let me know how it goes!

## **Registering on Sonatype**
Follow steps 1 and 2 [here](http://central.sonatype.org/pages/ossrh-guide.html) under "Create a ticket with Sonatype."

## **Generate your signing keys [[ref]](http://blog.sonatype.com/2010/01/how-to-generate-pgp-signatures-with-maven)**

If you don't have `gpg` installed: `brew install gpg`

Create a key by running `gpg --gen-key` and make sure to save your passphrase.

To get your keyId, run `gpg --list-keys` and you should get output similar to this:

{% highlight sh %}

/Users/YOUR_USERNAME/.gnupg/pubring.gpg
------------------------------------
pub   2048R/ABCD1234 YYYY-MM-DD
uid                  Your Name <your.email@domain.com>
sub   2048R/EFAB5678 YYYY-MM-DD

{% endhighlight %}

Grab your keyId (the piece after the `"2048/"`, in this example, `ABCD1234`) and run:

    gpg --keyserver hkp://pool.sks-keyservers.net \
        --send-keys YOUR_KEY_ID

## **Set your key in Gradle**
Create a file (if it doesn't already exist at `~/.gradle/gradle.properties` and add in the following lines:

{% highlight properties %}
# info from oss.sonatype.org. I recommend going to "https://oss.sonatype.org/" and clicking on your username at the top right, clicking Profile, and choosing "User Token" from the dropdown. You can substitue your actual username/password for those values generated.
NEXUS_USERNAME=YOUR_USER_NAME
NEXUS_PASSWORD=YOUR_PASSWORD

signing.keyId=YOUR_KEY_ID
signing.password=YOUR_GPG_PASSPHRASE
signing.secretKeyRingFile=/Users/YOUR_USERNAME/.gnupg/secring.gpg
{% endhighlight %}

## **Modify your Gradle script**
Add this to your module's `build.gradle` to make it produce a .jar in addition to a .aar. The last line is a helpful script to simplify sending the packaged files to Maven.

{% highlight groovy %}
android.libraryVariants.all { variant ->
    def name = variant.buildType.name
    if (!name.equals(com.android.builder.BuilderConstants.DEBUG)) {
        def task = project.tasks.create "jar${name.capitalize()}", Jar
        task.dependsOn variant.javaCompile
        task.from variant.javaCompile.destinationDir
        artifacts.add('archives', task);
    }
}

apply from: 'https://raw.github.com/chrisbanes/gradle-mvn-push/master/gradle-mvn-push.gradle'

{% endhighlight %}


## **Upload**
Run the following command to build and upload:

    ./gradlew clean build signArchives uploadArchives

You may also want to add something like this to your `build.gradle` so that archives are always signed. I haven't tried this though.

{% highlight groovy %}
uploadArchives.repositories.mavenDeployer.beforeDeployment {
    MavenDeployment deployment -> signing.signPom(deployment)
}
{% endhighlight %}

## **Release the archives**
Once the archives are pushed, log back on to [oss.sonatype.org](oss.sonatype.org) and click on "Staging Repositories". Select your uploaded archive and click "Close" (I'm not entirely sure at the moment why it must be closed first). Once this is done (you may need to refresh the tab), select it again and click "Release".

Go back to the initial Jira issue that you created and comment that you're done uploading to Sonatype. They should approve it and then it will be synced with Maven Central.

(I wrote this up after the fact but I think I covered all the bases. If something is missing as you use this guide, let me know and I'll updated it!)