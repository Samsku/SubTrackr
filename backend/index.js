require('dotenv').config()
const express = require('express')
const cors = require('cors')
require('./DB/mongoose')
const User = require('./model/user')
const port = process.env.PORT || 3000
const app = express()
const auth = require('./middleware/auth')
const Bill = require('./model/bills')
const Payments = require('./model/payment')
const Stripe = require('stripe')
const stripe = new Stripe (process.env.STRIPE_PRIVATE_KEY)

app.use(express.json())
app.use(cors())

app.get('/home',(req,res)=>{
    res.send("hello from server")
})

app.post('/user/signin',async (req,res)=>{
  try{

   
    const user = new User(req.body);
    const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
    })
    user.stripeCustomerId = customer.id

     
    

    await user.save();
    const token =await user.generateauthtoken()
    res.send({user,token})
  }catch(e){
    res.status(500).send({ error: e.message || 'An unknown error occurred during signin.' });
  }
})

app.post('/user/login', async (req,res)=>{
  try{
         const user = await User.findbycredential(req.body.email,req.body.password)     
         const token = await user.generateauthtoken() 
         user.lastLogin = new Date();
         await user.save()
      res.send({user,token})
  }catch(e){
    res.status(404).send(e)
  }

})

app.post('/bill', auth , async (req,res)=>{
  
  console.log('hello')
  try{
        const bill = new  Bill({
          ...req.body,
          owner:req.user._id
        })

        await bill.save()

        res.send(bill)
  }catch(e){
    res.status(400).send(e)
  }
})

app.get('/bill/me', auth, async (req,res)=>{
    try{
          
          const bill = await Bill.find({owner:req.user._id})

          if(!bill){
            res.status(404).send()
          }

          res.send(bill)
    }catch(e){
      res.status(400).send(e)
    }
})
app.delete('/bill/:id', auth, async(req, res)=>{
  try{
    const bill = await Bill.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if(!bill){
      return res.status(404).send();
    }
    res.send(bill);
  }catch(e){
    res.status(400).send(e)
  }
})

app.put('/bill/:id', auth, async(req,res)=>{ 
  try{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'amount', 'currency', 'remindertime'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const bill = await Bill.findOne({
      _id: req.params.id, 
      owner: req.user._id
    });

    if (!bill) {
      return res.status(404).send();
    }

    updates.forEach((update) => (bill[update] = req.body[update]));
    await bill.save();

    res.send(bill);
  }catch(e){
    res.status(400).send(e);
  }

})
//REST APIS operations for payments
app.post('/payments',auth, async(req, res)=>{
  try{
    const payment = new Payments({
      ...req.body,
      owner:req.user._id
    })
    await payment.save()
    res.status(201).send(payment)

  }catch(e){
    res.status(400).send(e);
  }
})

app.post('/create-setup-intent', auth, async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: req.user.stripeCustomerId,
      payment_method_types: ['card', 'paypal', 'klarna'],
    });
    res.send({ clientSecret: setupIntent.client_secret });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.get('/list-payment-methods', auth, async (req, res) => {
  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      req.user.stripeCustomerId,
      { type: 'card' } 
    );
    res.send(paymentMethods.data);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post('/detach-payment-method', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    await stripe.paymentMethods.detach(paymentMethodId);
    res.send({ success: true });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post('/attach-payment-method', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: req.user.stripeCustomerId,
    });
    res.send({ success: true });
  } catch (e) {
    console.log(e.message)
    res.status(200).send({ error: e.message });
  }
});

app.post('/subscribe-premium', auth, async (req, res) => {
  const PRICE_ID = process.env.PRICE_ID;
  try {
    const { paymentMethodId } = req.body;
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: req.user.stripeCustomerId,
    });

    await stripe.customers.update(req.user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    const subscription = await stripe.subscriptions.create({
      customer: req.user.stripeCustomerId,
      items: [{ price: PRICE_ID }],
      expand: ['latest_invoice.payment_intent'],
    });

    req.user.subscriptionPlan = 'premium';
    await req.user.save();

    res.send({ subscription, user: req.user });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.get('/subscription-status', auth, async (req, res) => {
  try {
    const isSubscribed = req.user.subscriptionPlan === 'premium';
    const subscriptions = await stripe.subscriptions.list({
      customer: req.user.stripeCustomerId,
      status: 'active',
    });
    const subscriptionId = subscriptions.data.length > 0 ? subscriptions.data[0].id : null;
    res.send({ isSubscribed, subscriptionId });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    req.user.subscriptionPlan = 'free';
    await req.user.save();

    res.send({ success: true, subscription: canceledSubscription });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.patch('/user/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.get('/billing', auth, async (req, res) => {
  try {
    const invoices = await stripe.invoices.list({
      customer: req.user.stripeCustomerId,
    });
    res.send(invoices.data);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.get('/export/subscriptions', auth, async (req, res) => {
  try {
    const bills = await Bill.find({ owner: req.user._id });

    if (!bills || bills.length === 0) {
      return res.status(404).send({ error: 'No subscriptions found to export.' });
    }

    const headers = ['Description', 'Amount', 'Currency', 'Reminder Date'];
    let csv = headers.join(',') + '\n';

    bills.forEach(bill => {
      const reminderDate = bill.remindertime ? new Date(bill.remindertime).toLocaleDateString() : '';
      const row = [
        `"${bill.description}"`,
        bill.amount,
        bill.currency,
        reminderDate,
      ].join(',');
      csv += row + '\n';
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('subscriptions.csv');
    res.send(csv);

  } catch (e) {
    res.status(500).send({ error: 'Failed to export subscriptions: ' + e.message });
  }
});

app.listen((port),()=>{
    console.log('hello from server')
})