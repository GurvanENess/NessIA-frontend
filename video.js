1 [{
  json: {
    status: 'need_user_input',
    question: 'Je vais maintenant générer une image. Puis-je continuer ?',
    fields: [
        {
            type: 'boolean',
            name: 'consent_to_image_generation',
            required: true,
            labels: {
                'true': 'Oui, vous pouvez générer l\'image.',
                'false': 'Non, je ne veux pas générer l\'image.'
            }
        }
    ]
  }
}];

2 [{
  json: {
    status: 'need_user_input',
    message: 'Je vais maintenant générer une image. Puis-je continuer ?',
    fields: [
        {
            type: 'boolean',
            name: 'consent_to_image_generation',
            required: true,
            labels: {
                'true': 'Oui, vous pouvez générer l\'image.',
                'false': 'Non, je ne veux pas générer l\'image.'
            }
        }
    ]
  }
}];

2 [{
  json: {
    status: 'need_user_input',
    message: 'Je vais maintenant générer une image. Puis-je continuer ?',
    fields: [
        {
            type: 'ratio',
            name: 'consent_to_image_generation',
            required: true,
            labels: {
                'true': 'Oui, vous pouvez générer l\'image.',
                'false': 'Non, je ne veux pas générer l\'image.'
            }
        }
    ]
  }
}];


"payload": {
        "steps": {
          "topic": {
            "title": "Sujet de la vidéo",
            "description": "Décrivez le sujet principal de la vidéo que vous souhaitez créer.",
            "fields": [
              {
                "name": "title",
                "type": "text",
                "placeholder": "Par exemple : 'Les bienfaits de la méditation'",
                "required": true,
                "value": null
              }
            ],
            "status": "pending"
          },
          "media_ids": {
            "title": "Médias à inclure",
            "description": "Sélectionnez les images ou vidéos que vous souhaitez inclure dans la vidéo finale.",
            "fields": [
              {
                "name": "assets",
                "type": "asset_ids",
                "required": true,
                "value": null
              }
            ],
            "status": "pending"
          },
          "style": {
            "title": "Style de la vidéo",
            "description": "Choisissez le style de la vidéo parmi les options disponibles.",
            "fields": [
              {
                "name": "style",
                "type": "select",
                "required": false,
                "value": null,
                "options": [
                  "fun",
                  "serious",
                  "expert"
                ]
              }
            ],
            "status": "pending"
          },
          "format": {
            "title": "Format de la vidéo",
            "description": "Sélectionnez le format de la vidéo.",
            "fields": [
              {
                "name": "format",
                "type": "select",
                "required": true,
                "value": null,
                "options": [
                  "short",
                  "long"
                ]
              }
            ],
            "status": "pending"
          }
        }
      }