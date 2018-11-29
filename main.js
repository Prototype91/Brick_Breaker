window.onload = () => {

    let context = window.document.getElementById('dessin').getContext('2d');

    //Début du code :
    console.log('Début du code !');

    // "Import" des classes box2dweb
    let b2World = Box2D.Dynamics.b2World;
    let b2Vec2 = Box2D.Common.Math.b2Vec2;
    let b2AABB = Box2D.Collision.b2AABB;
    let b2ContactListener = Box2D.Dynamics.b2ContactListener;
    let b2BodyDef = Box2D.Dynamics.b2BodyDef;
    let b2Body = Box2D.Dynamics.b2Body;
    let b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    let b2Fixture = Box2D.Dynamics.b2Fixture;
    let b2MassData = Box2D.Collision.Shapes.b2MassData;
    let b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    let b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    let b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    let b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

    //Création du monde :
    let gravity = new b2Vec2(0, 10);
    let world = new b2World(gravity);
    let scale = 40;

    //Création de la fixture une seule suffit :
    let fixDef = new b2FixtureDef();
    fixDef.density = 1;
    fixDef.friction = 0.3;
    fixDef.restitution = 1;

    //Création de la matière pour le sol :
    let groundBodyDef = new b2BodyDef();
    //Positions sol :
    groundBodyDef.position.Set(400 / scale, 590 / scale);
    groundBodyDef.type = b2Body.b2_staticBody;
    let groundBody = world.CreateBody(groundBodyDef);
    //Sol
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(1000 / scale, 10 / scale);
    groundBody.CreateFixture(fixDef);

    //Création de la matière pour le socle :
    let gameBodyDef = new b2BodyDef();
    let x = 400;
    let y = 550;
    //Positions socle :
    gameBodyDef.position.Set(x / scale, y / scale);
    gameBodyDef.type = b2Body.b2_kinematicBody;
    let gameBody = world.CreateBody(gameBodyDef);
    //Socle
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(45 / scale, 10 / scale);
    gameBody.CreateFixture(fixDef);

    let circleBodyDef = new b2BodyDef();
    //Positions Cercle :
    circleBodyDef.position.Set(400 / scale, 545 / scale);
    circleBodyDef.type = b2Body.b2_dynamicBody;
    let circleBody = world.CreateBody(circleBodyDef);
    //Bille
    fixDef.shape = new b2CircleShape(15 / scale);
    circleBody.CreateFixture(fixDef);

    let force = new b2Vec2(0, -10);
    let point = circleBody.GetPosition();

    circleBody.ApplyForce(force, point);

    let contactListener = new b2ContactListener();
    contactListener.BeginContact = (contact) => {
        console.log('contact');
    };
    world.SetContactListener(contactListener);

    let leftBodyDef = new b2BodyDef();
    //Positions mur gauche :
    leftBodyDef.position.Set(10 / scale, 400 / scale);
    groundBodyDef.type = b2Body.b2_staticBody;
    let leftBody = world.CreateBody(leftBodyDef);
    //Mur Gauche :
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(10 / scale, 2000 / scale);
    leftBody.CreateFixture(fixDef);

    let rightBodyDef = new b2BodyDef();
    //Positions mur droit :
    rightBodyDef.position.Set(790 / scale, 400 / scale);
    rightBodyDef.type = b2Body.b2_staticBody;
    let rightBody = world.CreateBody(rightBodyDef);
    //Mur Droit :
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(10 / scale, 2000 / scale);
    rightBody.CreateFixture(fixDef);

    let boxBodyDef = new b2BodyDef();
    //Positions box :
    /*boxBodyDef.position.Set(600 / scale, 450 / scale);
    boxBodyDef.type = b2Body.b2_staticBody;
    let boxBody = world.CreateBody(boxBodyDef);
    // box
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(50 / scale, 50 / scale);
    boxBody.CreateFixture(fixDef); */

    //Préparer simulation :
    let TimeStep = 1 / 60;

    // Définir la méthode d'affichage du débug
    let debugDraw = new b2DebugDraw();

    // Définir les propriétés d'affichage du débug
    debugDraw.SetSprite(context);      // contexte
    debugDraw.SetFillAlpha(0.3);       // transparence
    debugDraw.SetLineThickness(1.0);   // épaisseur du trait
    debugDraw.SetDrawScale(scale);

    // Affecter la méthode de d'affichage du débug au monde 2dbox
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    window.setInterval(() => {
        world.Step(TimeStep, 10, 10);
        world.DrawDebugData();
    }, 100 / 6);

    function createBall(x, y, restitution) {

        let fixDef = new b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.3;
        fixDef.restitution = restitution;

        let circleBodyDef = new b2BodyDef();
        circleBodyDef.position.Set(x / scale, y / scale);
        circleBodyDef.type = b2Body.b2_dynamicBody;
        let circleBody = world.CreateBody(circleBodyDef);
        fixDef.shape = new b2CircleShape(30 / scale);
        circleBody.CreateFixture(fixDef);

        return circleBody;
    };

    function createTriangle(x, y) {

        let fixDef = new b2FixtureDef();
        fixDef.shape = new b2PolygonShape(30 / scale);

        fixDef.density = 1;
        fixDef.friction = 0.3;
        fixDef.restitution = 1;

        let tabVec = [
            new b2Vec2(0, -1),
            new b2Vec2(2, 2),
            new b2Vec2(-1, 1),
        ];

        fixDef.shape.SetAsArray(tabVec, 3);

        let triangleBodyDef = new b2BodyDef();
        triangleBodyDef.position.Set(x / scale, y / scale);
        triangleBodyDef.type = b2Body.b2_dynamicBody;
        let triangleBody = world.CreateBody(triangleBodyDef);

        triangleBody.CreateFixture(fixDef);

    };

    function createHexagone(x, y) {

        let fixDef = new b2FixtureDef();
        fixDef.shape = new b2PolygonShape(30 / scale);

        fixDef.density = 1;
        fixDef.friction = 0.3;
        fixDef.restitution = 1;

        let tabVec = [
            new b2Vec2(2, -1),
            new b2Vec2(0, -1),
            new b2Vec2(0, 0),
            new b2Vec2(2, 0)
        ];

        fixDef.shape.SetAsBox(40 / scale, 18 / scale);

        let hexaBodyDef = new b2BodyDef();
        hexaBodyDef.position.Set(x / scale, y / scale);
        hexaBodyDef.type = b2Body.b2_staticBody;
        let hexaBody = world.CreateBody(hexaBodyDef);

        hexaBody.CreateFixture(fixDef);

    };

    const Keyboard = {};

    const keyMap = {
        37: 'LEFT',
        39: 'RIGHT',
        32: 'SPACE'
    };

    // Gestionnaire d'évènement :
    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKey);

    function onKey(event) {
        // event.keycode : 37, 38
        // event.type : 'keydown, 'keyup'  
        Keyboard[keyMap[event.keyCode]] = (event.type === 'keydown');
        if (Keyboard.RIGHT) {
            gameBody.SetLinearVelocity(new b2Vec2(10, 0))
            console.log('RIGHT');
            console.log(x);
        }
        if (Keyboard.LEFT) {
            gameBody.SetLinearVelocity(new b2Vec2(-10, 0))
            console.log('LEFT');
            console.log(x);
        }
    };

    createHexagone(97, 50);
    createHexagone(197, 50);
    createHexagone(297, 50);
    createHexagone(397, 50);
    createHexagone(497, 50);
    createHexagone(597, 50);
    createHexagone(697, 50);

    createHexagone(97, 110);
    createHexagone(197, 110);
    createHexagone(297, 110);
    createHexagone(397, 110);
    createHexagone(497, 110);
    createHexagone(597, 110);
    createHexagone(697, 110);

    createHexagone(97, 170);
    createHexagone(197, 170);
    createHexagone(297, 170);
    createHexagone(397, 170);
    createHexagone(497, 170);
    createHexagone(597, 170);
    createHexagone(697, 170);

    createHexagone(97, 230);
    createHexagone(197, 230);
    createHexagone(297, 230);
    createHexagone(397, 230);
    createHexagone(497, 230);
    createHexagone(597, 230);
    createHexagone(697, 230);

    createHexagone(97, 290);
    createHexagone(197, 290);
    createHexagone(297, 290);
    createHexagone(397, 290);
    createHexagone(497, 290);
    createHexagone(597, 290);
    createHexagone(697, 290);

    onKey(event);

};



