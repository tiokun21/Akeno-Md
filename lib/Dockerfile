FROM quay.io/sampandey001/secktor
RUN git clone https://github.com/Mnuvq/Akeno-Md /root/Mnuvq
WORKDIR /root/Mnuvq/
RUN yarn install --network-concurrency 1
CMD ["node", "lib/client.js"]
 
