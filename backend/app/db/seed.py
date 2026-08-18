from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    User, UserRole, CustomerAddress,
    Branch, BranchUser,
    Category, Product, ProductModifier, Inventory,
    Order, OrderItem, OrderStatusHistory, OrderStatus, OrderType, PaymentStatus,
    LoyaltyAccount, LoyaltyTransaction, LoyaltyReward,
    Coupon, Printer
)

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if database is already seeded
    if db.query(User).filter(User.email == "admin@pattyproject.co.uk").first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database with Patty Project UK production data...")

    # 1. Create Super Admin User
    admin = User(
        email="admin@pattyproject.co.uk",
        password_hash=get_password_hash("Admin123!"),
        full_name="Super Admin",
        phone="+44 20 7946 0912",
        role=UserRole.SUPER_ADMIN,
        is_active=True
    )
    db.add(admin)

    # 2. Create Branch Admins
    central_admin = User(
        email="central@pattyproject.co.uk",
        password_hash=get_password_hash("Central123!"),
        full_name="London Central Admin",
        phone="+44 7700 900111",
        role=UserRole.BRANCH_ADMIN,
        is_active=True
    )
    westfield_admin = User(
        email="westfield@pattyproject.co.uk",
        password_hash=get_password_hash("Westfield123!"),
        full_name="London Westfield Admin",
        phone="+44 7700 900222",
        role=UserRole.BRANCH_ADMIN,
        is_active=True
    )
    db.add_all([central_admin, westfield_admin])

    # 3. Create Sample Customer Users
    customer = User(
        email="john.smith@email.com",
        password_hash=get_password_hash("Customer123!"),
        full_name="John Smith",
        phone="+44 7123 456789",
        role=UserRole.CUSTOMER,
        is_active=True
    )
    customer2 = User(
        email="johnsmith@email.com",
        password_hash=get_password_hash("Customer123!"),
        full_name="John Smith",
        phone="+44 7123 456789",
        role=UserRole.CUSTOMER,
        is_active=True
    )
    db.add_all([customer, customer2])
    db.flush()

    # Customer Addresses matching UI design
    address1 = CustomerAddress(
        user_id=customer.id,
        label="Home",
        address_line1="21 Baker Street, Marylebone",
        address_line2="",
        city="London",
        postcode="NW1 6XE",
        phone="+44 7700 900123",
        is_default=True
    )
    address2 = CustomerAddress(
        user_id=customer.id,
        label="Work",
        address_line1="Patty Project Office, 12 Food Court",
        address_line2="King's Cross",
        city="London",
        postcode="N1C 4AG",
        phone="+44 7700 900456",
        is_default=False
    )
    address3 = CustomerAddress(
        user_id=customer.id,
        label="Other",
        address_line1="Flat 5, 88 Brook Green",
        address_line2="Hammersmith",
        city="London",
        postcode="W6 7BJ",
        phone="+44 7700 900789",
        is_default=False
    )
    db.add_all([address1, address2, address3])

    # Loyalty Account for Customers
    loyalty_acc = LoyaltyAccount(
        user_id=customer.id,
        available_points=1250,
        lifetime_points=2450,
        tier="SILVER"
    )
    loyalty_acc2 = LoyaltyAccount(
        user_id=customer2.id,
        available_points=1250,
        lifetime_points=2450,
        tier="SILVER"
    )
    db.add_all([loyalty_acc, loyalty_acc2])

    # 4. Create Initial UK Branches
    branch_central = Branch(
        code="LC",
        name="London - Central",
        address_line1="45 Camden High Street",
        postcode="NW1 7JE",
        city="London",
        latitude=51.5360,
        longitude=-0.1420,
        phone="+44 20 7417 5211",
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        delivery_radius_miles=2.0,
        opening_hours={"monday": {"open": "10:00", "close": "23:00"}, "tuesday": {"open": "10:00", "close": "23:00"}, "wednesday": {"open": "10:00", "close": "23:00"}, "thursday": {"open": "10:00", "close": "23:00"}, "friday": {"open": "10:00", "close": "00:00"}, "saturday": {"open": "10:00", "close": "00:00"}, "sunday": {"open": "10:00", "close": "22:00"}},
        is_active=True
    )
    branch_westfield = Branch(
        code="LW",
        name="London - Westfield",
        address_line1="Ariel Way, Shepherd's Bush",
        postcode="W12 7GF",
        city="London",
        latitude=51.5074,
        longitude=-0.2217,
        phone="+44 20 8749 8899",
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        delivery_radius_miles=3.0,
        opening_hours={"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "21:00"}},
        is_active=True
    )
    db.add_all([branch_central, branch_westfield])
    db.flush()

    # Assign branch admins
    db.add_all([
        BranchUser(user_id=central_admin.id, branch_id=branch_central.id),
        BranchUser(user_id=westfield_admin.id, branch_id=branch_westfield.id),
    ])

    # 5. Create Categories
    cat_burgers = Category(name="Burgers", slug="burgers", icon="hamburger", display_order=1)
    cat_chicken = Category(name="Chicken", slug="chicken", icon="drumstick", display_order=2)
    cat_sides = Category(name="Sides", slug="sides", icon="fries", display_order=3)
    cat_extras = Category(name="Extras", slug="extras", icon="plus", display_order=4)
    cat_dips = Category(name="Dips", slug="dips", icon="sauce", display_order=5)
    cat_drinks = Category(name="Drinks", slug="drinks", icon="cup", display_order=6)
    db.add_all([cat_burgers, cat_chicken, cat_sides, cat_extras, cat_dips, cat_drinks])
    db.flush()

    # 6. Create Products
    p1 = Product(
        category_id=cat_burgers.id,
        name="Mc Project",
        sku="BURG001",
        short_description="Double beef, double American cheese, burger sauce, lettuce, onion & gherkins.",
        full_description="A premium double smash beef burger made with 100% British beef, fresh lettuce, sliced tomatoes, onions, pickles, cheddar cheese and our signature Patty sauce served in a toasted brioche bun.",
        image_url="/placeholder-burger.svg",
        base_price=8.95,
        rating=4.7,
        reviews_count=312,
        is_bestseller=True
    )
    p2 = Product(
        category_id=cat_burgers.id,
        name="Outlaw Project",
        sku="BURG002",
        short_description="Smoky BBQ beef patty, smoked bacon, crispy onion rings & melted cheddar.",
        full_description="Juicy beef patty topped with smoked streaky bacon, melted American cheese, beer-battered onion rings and house BBQ sauce.",
        image_url="/placeholder-burger.svg",
        base_price=8.95,
        rating=4.6,
        reviews_count=189,
        is_bestseller=True
    )
    p3 = Product(
        category_id=cat_burgers.id,
        name="Pastrami Burger",
        sku="BURG003",
        short_description="Beef patty loaded with cured pastrami, Swiss cheese & yellow mustard.",
        full_description="Artisanal smash burger topped with sliced cured brisket pastrami, melted Swiss cheese, gherkin relish and spicy mustard.",
        image_url="/placeholder-burger.svg",
        base_price=8.95,
        rating=4.6,
        reviews_count=145,
        is_bestseller=True
    )
    p4 = Product(
        category_id=cat_chicken.id,
        name="Fried Chicken Sando",
        sku="CHIK001",
        short_description="Crispy buttermilk fried chicken breast, spicy mayo & dill pickle slaw.",
        full_description="Hand-breaded buttermilk fried chicken fillet served with chipotle mayo, house pickles and crunchy cabbage slaw in a brioche bun.",
        image_url="/placeholder-burger.svg",
        base_price=8.45,
        rating=4.6,
        reviews_count=210,
        is_bestseller=True
    )
    p5 = Product(
        category_id=cat_burgers.id,
        name="Halloumi Burger",
        sku="BURG004",
        short_description="Grilled halloumi, roasted red pepper, sweet chili jam & rocket.",
        full_description="Thick-cut grilled Cyprus halloumi cheese with fire-roasted peppers, sweet chili relish, fresh rocket and garlic mayo in a brioche bun.",
        image_url="/placeholder-burger.svg",
        base_price=8.45,
        rating=4.5,
        reviews_count=165,
        is_bestseller=True
    )
    p6 = Product(
        category_id=cat_sides.id,
        name="Loaded Fries",
        sku="FRIES002",
        short_description="Fries topped with cheese sauce, crispy bacon bits & jalapeños.",
        full_description="Skin-on fries smothered in warm cheddar cheese sauce, crispy smoked bacon pieces, chopped jalapeños and green onion.",
        image_url="/placeholder-burger.svg",
        base_price=6.45,
        rating=4.5,
        reviews_count=178,
        is_bestseller=True
    )
    p7 = Product(
        category_id=cat_drinks.id,
        name="Coca Cola 330ml",
        sku="DRINK001",
        short_description="Chilled original taste Coca-Cola can.",
        full_description="Classic ice-cold Coca Cola 330ml can.",
        image_url="/placeholder-burger.svg",
        base_price=1.50,
        rating=4.9,
        reviews_count=500,
        is_bestseller=False
    )
    db.add_all([p1, p2, p3, p4, p5, p6, p7])
    db.flush()

    # Product Modifiers (Add-ons)
    db.add_all([
        ProductModifier(product_id=p1.id, name="Extra Beef Patty", price=2.00),
        ProductModifier(product_id=p1.id, name="Bacon", price=1.50),
        ProductModifier(product_id=p1.id, name="Jalapeños", price=0.80),
        ProductModifier(product_id=p1.id, name="Extra Cheese", price=0.80),
        ProductModifier(product_id=p2.id, name="Extra Beef Patty", price=2.00),
        ProductModifier(product_id=p2.id, name="Bacon", price=1.50),
        ProductModifier(product_id=p2.id, name="Jalapeños", price=0.80),
    ])

    # Branch Inventory
    for prod in [p1, p2, p3, p4, p5, p6, p7]:
        db.add(Inventory(branch_id=branch_central.id, product_id=prod.id, stock_quantity=100))
        db.add(Inventory(branch_id=branch_westfield.id, product_id=prod.id, stock_quantity=80))

    # 7. Create Coupons
    db.add_all([
        Coupon(code="WELCOME10", name="Welcome Offer", coupon_type="PERCENTAGE", discount_value=10.0, min_order_value=15.0, usage_limit=1000, used_count=432),
        Coupon(code="BURGER20", name="Burger Bonanza", coupon_type="PERCENTAGE", discount_value=20.0, min_order_value=20.0, usage_limit=500, used_count=278),
        Coupon(code="FREESHIP", name="Free Shipping", coupon_type="FREE_SHIPPING", discount_value=0.0, min_order_value=10.0, usage_limit=9999, used_count=1245),
        Coupon(code="FLAT15", name="Flat 15 Off", coupon_type="FIXED_AMOUNT", discount_value=15.0, min_order_value=50.0, usage_limit=300, used_count=103),
    ])

    # 8. Create Loyalty Rewards
    db.add_all([
        LoyaltyReward(title="Free Classic French Fries", description="Get regular crispy fries absolutely free!", points_required=500, reward_type="FREE_ITEM", product_id=p5.id),
        LoyaltyReward(title="20% Off Entire Order", description="Get 20% off discount code for your next order!", points_required=1000, reward_type="DISCOUNT_AMOUNT", discount_value=20.0),
        LoyaltyReward(title="Free Gourmet Patty Burger", description="Get any classic burger free on your next meal!", points_required=1500, reward_type="FREE_ITEM", product_id=p1.id),
        LoyaltyReward(title="Free Family Feast Box", description="Get a free Family Feast Box reward at 2500 points!", points_required=2500, reward_type="FREE_ITEM"),
    ])

    # 9. Create Sample Orders
    order_incoming = Order(
        order_number="#PP1260",
        customer_id=customer.id,
        customer_name="Sarah Jenkins",
        customer_email="sarah.j@email.com",
        customer_phone="+44 7987 654321",
        branch_id=branch_central.id,
        order_type=OrderType.DELIVERY,
        status=OrderStatus.INCOMING,
        delivery_address={
            "address_line1": "14 Regent Street",
            "city": "London",
            "postcode": "NW1 5RT"
        },
        delivery_instructions="Ring the bell on arrival",
        subtotal=22.40,
        delivery_fee=2.50,
        service_fee=0.99,
        discount_amount=0.0,
        vat_amount=4.48,
        total_amount=25.89,
        payment_method="Online (Card)",
        payment_status=PaymentStatus.PAID,
        payment_transaction_id="TXN9823412345",
        points_earned=220
    )

    order_accepted = Order(
        order_number="#PP1259",
        customer_id=customer2.id,
        customer_name="David Miller",
        customer_email="david.m@email.com",
        customer_phone="+44 7890 123456",
        branch_id=branch_westfield.id,
        order_type=OrderType.COLLECTION,
        status=OrderStatus.ACCEPTED,
        subtotal=18.50,
        delivery_fee=0.0,
        service_fee=0.99,
        discount_amount=0.0,
        vat_amount=3.70,
        total_amount=19.49,
        payment_method="Online (Card)",
        payment_status=PaymentStatus.PAID,
        payment_transaction_id="TXN5544332211",
        points_earned=180
    )

    sample_order = Order(
        order_number="#PP1258",
        customer_id=customer.id,
        customer_name="John Smith",
        customer_email="john.smith@email.com",
        customer_phone="+44 7123 456789",
        branch_id=branch_central.id,
        order_type=OrderType.DELIVERY,
        status=OrderStatus.PREPARING,
        delivery_address={
            "address_line1": "123 Baker Street",
            "address_line2": "Near Baker Street Station",
            "city": "London",
            "postcode": "W1U 6EP"
        },
        delivery_instructions="Leave at the door",
        subtotal=14.66,
        delivery_fee=2.49,
        service_fee=0.99,
        discount_amount=0.0,
        vat_amount=2.93,
        total_amount=24.98,
        payment_method="Online (Card)",
        payment_status=PaymentStatus.PAID,
        payment_transaction_id="TXN4789632145",
        points_earned=150
    )

    order_ready = Order(
        order_number="#PP1257",
        customer_id=customer2.id,
        customer_name="Emma Watson",
        customer_email="emma.w@email.com",
        customer_phone="+44 7456 789012",
        branch_id=branch_central.id,
        order_type=OrderType.DELIVERY,
        status=OrderStatus.READY,
        delivery_address={
            "address_line1": "78 Oxford Street",
            "city": "London",
            "postcode": "W1D 1BS"
        },
        delivery_instructions="Deliver to front desk",
        subtotal=31.00,
        delivery_fee=2.50,
        service_fee=0.99,
        discount_amount=0.0,
        vat_amount=6.20,
        total_amount=34.49,
        payment_method="Online (Card)",
        payment_status=PaymentStatus.PAID,
        payment_transaction_id="TXN7788990011",
        points_earned=310
    )

    order_delivered = Order(
        order_number="#PP1256",
        customer_id=customer.id,
        customer_name="Liam Gallagher",
        customer_email="liam.g@email.com",
        customer_phone="+44 7321 654987",
        branch_id=branch_westfield.id,
        order_type=OrderType.DELIVERY,
        status=OrderStatus.DELIVERED,
        delivery_address={
            "address_line1": "55 Shepherd's Bush Green",
            "city": "London",
            "postcode": "W12 8QE"
        },
        delivery_instructions="Call when outside",
        subtotal=19.95,
        delivery_fee=2.50,
        service_fee=0.99,
        discount_amount=0.0,
        vat_amount=3.99,
        total_amount=23.44,
        payment_method="Online (Card)",
        payment_status=PaymentStatus.PAID,
        payment_transaction_id="TXN6655443322",
        points_earned=200
    )

    db.add_all([order_incoming, order_accepted, sample_order, order_ready, order_delivered])
    db.flush()

    db.add_all([
        OrderItem(order_id=order_incoming.id, product_id=p1.id, product_name="Classic Beef Burger", quantity=2, unit_price=8.99, total_price=17.98),
        OrderItem(order_id=order_incoming.id, product_id=p5.id, product_name="French Fries (Regular)", quantity=1, unit_price=2.49, total_price=2.49),
        OrderStatusHistory(order_id=order_incoming.id, from_status=None, to_status=OrderStatus.INCOMING, notes="Order placed by customer"),

        OrderItem(order_id=order_accepted.id, product_id=p2.id, product_name="Double Patty Smash", quantity=1, unit_price=11.95, total_price=11.95),
        OrderItem(order_id=order_accepted.id, product_id=p6.id, product_name="Loaded Cheesy Bacon Fries", quantity=1, unit_price=6.45, total_price=6.45),
        OrderStatusHistory(order_id=order_accepted.id, from_status=OrderStatus.INCOMING, to_status=OrderStatus.ACCEPTED, notes="Order accepted by store"),

        OrderItem(order_id=sample_order.id, product_id=p1.id, product_name="Classic Beef Burger", quantity=1, unit_price=8.99, total_price=8.99, selected_modifiers=[{"name": "No onion"}, {"name": "Extra cheese", "price": 0.80}]),
        OrderItem(order_id=sample_order.id, product_id=p5.id, product_name="French Fries (Regular)", quantity=1, unit_price=2.49, total_price=2.49),
        OrderItem(order_id=sample_order.id, product_id=p7.id, product_name="Coca Cola 500ml", quantity=2, unit_price=1.59, total_price=3.18),
        OrderStatusHistory(order_id=sample_order.id, from_status=OrderStatus.ACCEPTED, to_status=OrderStatus.PREPARING, notes="Kitchen preparing food"),

        OrderItem(order_id=order_ready.id, product_id=p3.id, product_name="Spicy Nashville Chicken", quantity=2, unit_price=9.45, total_price=18.90),
        OrderItem(order_id=order_ready.id, product_id=p5.id, product_name="French Fries (Regular)", quantity=2, unit_price=2.49, total_price=4.98),
        OrderStatusHistory(order_id=order_ready.id, from_status=OrderStatus.PREPARING, to_status=OrderStatus.READY, notes="Order packed and ready for driver"),

        OrderItem(order_id=order_delivered.id, product_id=p4.id, product_name="Truffle Mushroom Burger", quantity=1, unit_price=10.95, total_price=10.95),
        OrderItem(order_id=order_delivered.id, product_id=p5.id, product_name="French Fries (Regular)", quantity=1, unit_price=2.49, total_price=2.49),
        OrderStatusHistory(order_id=order_delivered.id, from_status=OrderStatus.READY, to_status=OrderStatus.DELIVERED, notes="Driver delivered order to customer")
    ])

    db.commit()
    db.close()
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    seed_db()
