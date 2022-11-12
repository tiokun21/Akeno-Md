FROM quay.io/sampandey001/secktor
RUN git clone https://github.com/tiokun21/Akeno-Md /root/tiokun21
WORKDIR /root/tiokun21
RUN yarn install --network-concurrency 1
CMD ["node", "lib/client.js"]
 
