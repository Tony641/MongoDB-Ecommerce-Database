/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('EcommerceDatabase');

//Users Collection
db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { bsonType: "string" },
          email: { bsonType: "string" },
          password: { bsonType: "string" },
          
          gender: { bsonType: "string" },
       
          dateOfBirth: { bsonType: "date" },
          
          
          phone: { bsonType: "string" },
          avatar: { bsonType: "string" },
          role: {
            bsonType: "string",
            enum: ["user", "admin","vendor"]
            default: "user" 
          },
   
          authMethods: {
            bsonType: "array",
            items: {
              bsonType: "string",
              enum: ["email", "google", "facebook", "phone"]
            }
          },
          addresses: {
            bsonType: "array",
            items: { bsonType: "objectId", description: "Reference to addresses" }
          },
          orders: {
            bsonType: "array",
            items: { bsonType: "objectId", description: "Reference to orders" }
          },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" }
        }
      }
    }
  });

  db.users.createIndex({ email: 1 }, { unique: true });


//address collection

db.createCollection("addresses", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "street", "city", "state", "country", "zipCode"],
        properties: {
          userId: { bsonType: "objectId" },
          street: { bsonType: "string" },
          city: { bsonType: "string" },
          state: { bsonType: "string" },
          country: { bsonType: "string" },
          zipCode: { bsonType: "string" },
          isDefault: { bsonType: "bool", default: false }
        }
      }
    }
  });

  
// 3. Categories Collection



db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "slug"],
      properties: {
        name: { bsonType: "string" },
        slug: { bsonType: "string" },
        description: { bsonType: "string" },
        image: { bsonType: "string" },
        isActive: { bsonType: "bool", default: true }
      }
    }
  }
});

db.categories.createIndex({ slug: 1 }, { unique: true });


// 4. Subcategories Collection

db.createCollection("subcategories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "slug", "categoryId"],
      properties: {
        name: { bsonType: "string" },
        slug: { bsonType: "string" },
        categoryId: { bsonType: "objectId" },
        description: { bsonType: "string" },
        image: { bsonType: "string" },
        isActive: { bsonType: "bool", default: true }
      }
    }
  }
});
 
db.subcategories.createIndex({ slug: 1 }, { unique: true });


// 5. Products Collection (Main Collection)

db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "slug", "categoryId", "subcategoryId", "type"],
      properties: {
        name: { bsonType: "string" },
        slug: { bsonType: "string" },
        description: { bsonType: "string" },
        categoryId: { bsonType: "objectId" },
        subcategoryId: { bsonType: "objectId" },
        type: {
          bsonType: "string",
          enum: ["single", "variable"],
          default: "single"
        },
        mainImage: { bsonType: "string" },
        images: { bsonType: "array", items: { bsonType: "string" } },
        price: { bsonType: "double" },
        comparePrice: { bsonType: "double" },
        stock: { bsonType: "int" },
        sku: { bsonType: "string" },
        variants: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              attributes: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  properties: {
                    name: { bsonType: "string" }, // e.g., "color"
                    value: { bsonType: "string" } // e.g., "red"
                  }
                }
              },
              price: { bsonType: "double" },
              stock: { bsonType: "int" },
              sku: { bsonType: "string" },
              images: { bsonType: "array", items: { bsonType: "string" } }
            }
          }
        },
        isFeatured: { bsonType: "bool", default: false },
        isActive: { bsonType: "bool", default: true }
      }
    }
  }
});


db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ categoryId: 1, subcategoryId: 1 });


// 6. Orders Collection
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "items", "total", "status"],
      properties: {
        userId: { bsonType: "objectId" },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["productId", "quantity", "price"],
            properties: {
              productId: { bsonType: "objectId" },
              variantId: { bsonType: "string" }, // For variable products
              quantity: { bsonType: "int" },
              price: { bsonType: "double" }
            }
          }
        },
        total: { bsonType: "double" },
        shippingAddress: { bsonType: "objectId" },
        paymentMethod: {
          bsonType: "string",
          enum: ["cod", "card", "paypal"]
        },
        paymentStatus: {
          bsonType: "string",
          enum: ["pending", "completed", "failed"],
          default: "pending"
        },
        status: {
          bsonType: "string",
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
          default: "pending"
        }
      }
    }
  }
});


// 7. Banners Collection
db.createCollection("banners", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["image", "redirectTo"],
        properties: {
          image: { bsonType: "string" },
          redirectTo: { bsonType: "string" },
          order: { bsonType: "int" },
          isActive: { bsonType: "bool", default: true }
        }
      }
    }
  });


  
// 8. Featured Products Collection
db.createCollection("featured_products", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["productId"],
        properties: {
          productId: { bsonType: "objectId" },
          order: { bsonType: "int" },
          startDate: { bsonType: "date" },
          endDate: { bsonType: "date" },
          isActive: { bsonType: "bool", default: true }
        }
      }
    }
  });

  
// 9. Coupons Collection (Additional Recommended)

db.createCollection("coupons", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "discountType", "value"],
      properties: {
        code: { bsonType: "string" },
        discountType: {
          bsonType: "string",
          enum: ["percentage", "fixed"]
        },
        value: { bsonType: "double" },
        minPurchase: { bsonType: "double" },
        maxUses: { bsonType: "int" },
        usedCount: { bsonType: "int", default: 0 },
        expiresAt: { bsonType: "date" }
      }
    }
  }
});
db.coupons.createIndex({ code: 1 }, { unique: true });


// 10. Reviews Collection (Additional Recommended)


  
// 11. Cart Collection (Additional Recommended)
db.createCollection("carts", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId"],
        properties: {
          userId: { bsonType: "objectId" },
          items: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                productId: { bsonType: "objectId" },
                variantId: { bsonType: "string" },
                quantity: { bsonType: "int" }
              }
            }
          }
        }
      }
    }
  });

  // 1. Updated Users Collection (Multiple Auth Methods)
 
db.users.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ facebookId: 1 }, { unique: true, sparse: true });




// 2. Social Auth Connections Collection
db.createCollection("social_auth", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "provider", "providerId"],
        properties: {
          userId: { bsonType: "objectId" },
          provider: { bsonType: "string", enum: ["google", "facebook"] },
          providerId: { bsonType: "string" },
          accessToken: { bsonType: "string" },
          refreshToken: { bsonType: "string" }
        }
      }
    }
  });

  
// 3. Phone Verification Collection
db.createCollection("phone_verifications", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["phoneNumber", "code", "expiresAt"],
        properties: {
        countryCode: { bsonType: "string" },
          phoneNumber: { bsonType: "string" },
          code: { bsonType: "string" },
          expiresAt: { bsonType: "date" },
          verified: { bsonType: "bool" , default: false}
        }
      }
    }
  });


  db.createCollection("email_verifications", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "code", "expiresAt"],
        properties: {
          email: { bsonType: "string" },
          code: { bsonType: "string" },
          expiresAt: { bsonType: "date" },
          verified: { bsonType: "bool",default: false}
        }
      }
    }
  });
  
 
  

// 4. Enhanced Reviews Collection
db.createCollection("reviews", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "productId", "rating"],
        properties: {
          userId: { bsonType: "objectId" },
          productId: { bsonType: "objectId" },
          rating: { bsonType: "int", minimum: 1, maximum: 5 },
          title: { bsonType: "string" },
          comment: { bsonType: "string" },
          images: { bsonType: "array", items: { bsonType: "string" } },
          verifiedPurchase: { bsonType: "bool", default: false },
          replies: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                userId: { bsonType: "objectId" },
                message: { bsonType: "string" },
                createdAt: { bsonType: "date" }
              }
            }
          }
        }
      }
    }
  });


  
// 5. Customer Support Collection
db.createCollection("support_tickets", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "type", "status", "message"],
        properties: {
          userId: { bsonType: "objectId" },
          type: {
            bsonType: "string",
            enum: ["complaint", "return", "general", "technical"]
          },
          status: {
            bsonType: "string",
            enum: ["open", "pending", "resolved", "closed"],
            default: "open"
          },
          message: { bsonType: "string" },
          attachments: { bsonType: "array", items: { bsonType: "string" } },
          responses: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                adminId: { bsonType: "objectId" },
                message: { bsonType: "string" },
                createdAt: { bsonType: "date" }
              }
            }
          }
        }
      }
    }
  });

  
// 6. Wishlist Collection
db.createCollection("wishlists", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId"],
        properties: {
          userId: { bsonType: "objectId" },
          items: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                productId: { bsonType: "objectId" },
                addedAt: { bsonType: "date" }
              }
            }
          }
        }
      }
    }
  });
  

  
// 7. Session Management Collection
db.createCollection("sessions", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "token", "expiresAt"],
        properties: {
          userId: { bsonType: "objectId" },
          token: { bsonType: "string" },
          expiresAt: { bsonType: "date" },
          deviceInfo: { bsonType: "object" },
          ipAddress: { bsonType: "string" }
        }
      }
    }
  });

  
// 8. Password Reset Collection
db.createCollection("password_resets", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "token", "expiresAt"],
        properties: {
          userId: { bsonType: "objectId" },
          token: { bsonType: "string" },
          expiresAt: { bsonType: "date" },
          used: { bsonType: "bool", default: false }
        }
      }
    }
  });

  
// 9. Notification System Collection
db.createCollection("notifications", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "type", "message"],
        properties: {
          userId: { bsonType: "objectId" },
          type: {
            bsonType: "string",
            enum: ["order", "promotion", "system", "alert"]
          },
          message: { bsonType: "string" },
          read: { bsonType: "bool", default: false },
          metadata: { bsonType: "object" },
          createdAt: { bsonType: "date" }
        }
      }
    }
  });
  
  
// 10. Audit Logs Collection
db.createCollection("audit_logs", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["action", "entityType", "entityId"],
        properties: {
          userId: { bsonType: "objectId" },
          action: { bsonType: "string" },
          entityType: { bsonType: "string" },
          entityId: { bsonType: "objectId" },
          details: { bsonType: "object" },
          ipAddress: { bsonType: "string" },
          timestamp: { bsonType: "date" }
        }
      }
    }
  });
  

  
// 11. Return/Refund Collection
db.createCollection("returns", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "orderId", "status"],
        properties: {
          userId: { bsonType: "objectId" },
          orderId: { bsonType: "objectId" },
          status: {
            bsonType: "string",
            enum: ["requested", "approved", "rejected", "completed"]
          },
          reason: { bsonType: "string" },
          items: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                productId: { bsonType: "objectId" },
                quantity: { bsonType: "int" }
              }
            }
          }
        }
      }
    }
  });
  
  
// 12. Browsing History Collection
db.createCollection("browsing_history", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "productId"],
        properties: {
          userId: { bsonType: "objectId" },
          productId: { bsonType: "objectId" },
          timestamp: { bsonType: "date" }
        }
      }
    }
  });

  