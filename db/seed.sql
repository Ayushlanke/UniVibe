-- ============================================================================
--  UniVibe — Demo Seed Data
--  Run AFTER db/schema.sql (best applied in the Supabase SQL Editor).
--
--  Inserts realistic demo gossips + chat messages so the feed, shared-post
--  view and Campus Connect room show content immediately.
--  (user_id is NULL → these read as guest/demo-published rows.)
-- ============================================================================

-- ---------------------------------------------------------------------------
--  DEMO GOSSIP POSTS
-- ---------------------------------------------------------------------------
insert into public.gossipbar (user_id, username, title, content, images, likes, created_at)
values
  (null, 'chai_buddy', 'Hot take: 9 AM lectures should be illegal 🛏️',
   'Nobody is emotionally prepared for thermodynamics at 9AM. The professor literally greets us with "good morning, survivors". Surviving WHAT sir, the chairs are velcro.',
   null, 132, now() - interval '35 minutes'),

  (null, 'library_phantom', 'The library quiet floor is a myth 💀',
   'Someone pulled up with a full Bluetooth speaker on the "silent" floor yesterday. The librarian just stared at them for 30 seconds and walked away. We accept defeat.',
   null, 89, now() - interval '1 hour 10 minutes'),

  (null, 'canteen_critic', 'Rating the canteen burgers so you don''t have to 🍔',
   'The "Double Decker Deluxe" is 60% bread, 30% hope, and 10% mystery patty. 6/10 with tears, 8/10 if you ignore the existence of mayo.',
   null, 57, now() - interval '2 hours 5 minutes'),

  (null, 'assignment_gremlin', 'PSA: there are only 3 days left for the DBMS project',
   'That is all. Go touch grass, then come back and finish your ER diagram. You know who you are (it''s me, I''m who).',
   null, 214, now() - interval '4 hours 30 minutes'),

  (null, 'lecture_slides', 'Prof, if you could please send the slides BEFORE the exam 🥲',
   '72 slides covering the full semester, dropped 6 hours before the exam. Breathtaking. Cinematic. Absolutely unhinged.',
   null, 178, now() - interval '6 hours'),

  (null, 'campus_wifi', 'Campus wifi when you actually need it: 📶💀',
   'Randomly faster at 2am in the parking lot than at 11am in the main building. The 4G heroics I perform in class should be studied by scientists.',
   null, 98, now() - interval '9 hours'),

  (null, 'wingman_wyatt', 'Whoever runs the "seniors vs juniors" tug of war, thank you 🙏',
   'Someone fell, someone else caught them, the rope broke, we all laughed for 40 minutes. This is the content I signed up for.',
   null, 45, now() - interval '1 day 2 hours'),

  (null, 'mysterio_senpai', 'Confession: I charge my laptop in the projector room',
   'The door is "staff only" but nobody locks it after 6. I have brought peace to my dying battery. Do not test me, I have nothing to lose.',
   null, 333, now() - interval '1 day 6 hours');

-- ---------------------------------------------------------------------------
--  DEMO CAMPUS CONNECT CHAT MESSAGES (realtime feed)
-- ---------------------------------------------------------------------------
insert into public.messages (user_id, username, message, created_at)
values
  (null, 'night_owl', 'Anyone else still up for the ACM hackathon?', now() - interval '2 minutes'),
  (null, 'chai_buddy', 'Count me in, bringing snacks 🍪', now() - interval '1 minute 30 seconds'),
  (null, 'canteen_critic', 'If the snacks contain mayo I am walking out', now() - interval '1 minute'),
  (null, 'wingman_wyatt', 'LMAOOO the canteen has traumatized them', now() - interval '40 seconds'),
  (null, 'night_owl', 'OK but seriously who''s pairing up for the ML problem?', now() - interval '25 seconds'),
  (null, 'campus_wifi', 'Me, but only if the wifi cooperates at 3am 😭', now() - interval '10 seconds');

-- Next, open the app, sign up, and add your username so your OWN posts
-- (through the normal insert_into_gossipbar flow) attach to your account:

--   insert into public.profiles (id, username)
--   values (auth.uid(), 'your_username')
--   on conflict (id) do nothing;