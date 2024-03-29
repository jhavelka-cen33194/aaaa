# Environments for OCP3 Deployment

This action and reusable workflow is designed to work with
the [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
. For each target namespace, environment in GitHub must be manually created.

---

Here are deva and prod environments. Add every environment you use.
![image](https://user-images.githubusercontent.com/75479014/198976209-70e46427-cbac-41c5-96ca-38314127911a.png)

---

Add new environment. It can be named however you want, but prepared examples assumes it is named in `env/<name>` format.
![image](https://user-images.githubusercontent.com/75479014/198976609-cc88ea31-accc-4e4b-8ad2-220bb317b1dc.png)

---

For security reasons, it is important to limit the enviroment only to specific branch.
![image](https://user-images.githubusercontent.com/75479014/198976787-2feee3e5-2673-4fbe-b46f-9fe95e5a278d.png)

---

Next, add secrets `OPENSHIFT_TOKEN` and `OPENSHIFT_CA`. Token needs to be taken from ServiceAccount,
that will be used for the deployment. CA bundle is per cluster. ServiceAccount needs to have enough
privileges to do helm install, which includes reading/writing Secrets.

Copy secrets from OpenShift:

![image](https://user-images.githubusercontent.com/75479014/198978560-d715f7d7-39f1-4435-b4c1-804465907e68.png)

Add them to the environment:

![image](https://user-images.githubusercontent.com/75479014/198977523-4bf911ae-06f9-498b-bf36-ea2191fb28bb.png)

---

Properly configured environment should look like this
![image](https://user-images.githubusercontent.com/75479014/198977751-7dd83295-60a8-4a28-89ba-d749c3e65f58.png)
