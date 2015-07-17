#include <pebble.h>
#define CARD_IDS 0
#define CARD_NAMES 1
#define CARD_ID_BOARDS 2
#define CARD_NAME_BOARDS 3
#define CARD_ID_LISTS 4
#define CARD_NAME_LISTS 5
#define CARD_DUE_DATES 6
#define CARD_QUANTITY 7
static Window *s_main_window;
static MenuLayer *s_menulayer_main;

char[][30] cardIds;
char[][100] cardNames;
char[][40] cardIdBoards;
char[][30] cardNameBoards;
char[][30] cardIdLists;
char[][30] cardNameLists;
char[][30] cardDueDates;
int cardQuantity;


//REFRESH FUNCTIONS -----------------------------------

static void reload_cards() {
  //check for Due Date vs. Board
  //check for changes
  //grab JSON object from Trello API
  //add cards to Past Due
  //add cards to Due Soon
  //add cards to Due Later
  //add cards to Due Eventually
  //add cards to No Due Date
  //for every menu item, add 'select' functionality  
}

static void update_time() {
  //get a tm structure
  
  //create a long-lived buffer
  
  //write the current hours and minutes into the buffer
  
  //display this time on the TextLayer
}

//MENU LAYER CALLBACKS
uint16_t num_rows_callback(MenuLayer *menu_layer, uint16_t section_index, void *callback_context)
{
    return 7;
}

//MAIN WINDOW LOAD/UNLOAD ------------------------------
static void main_window_load(Window *window) {
  s_main_window = window_create();
  #ifndef PBL_SDK_3
    window_set_fullscreen(s_main_window, false);
  #endif
  
  // s_menulayer_main
  s_menulayer_main = menu_layer_create(GRect(0, 0, 144, 152));
  menu_layer_set_click_config_onto_window(s_menulayer_main, s_main_window);
  layer_add_child(window_get_root_layer(s_main_window), (Layer *)s_menulayer_main);
  //improve the layout to be more like a watchface
  //add it as a child layer to the Window's root layer
  layer_add_child(window_get_root_layer(s_main_window), menu_layer_get_layer(s_menulayer_main));
}
static void main_window_unload(Window *window) {
  //destroy MenuLayer
  menu_layer_destroy(s_menulayer_main);
  //destroy Window
  window_destroy(s_main_window);
}

//TICK UPDATE
static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
}

//APPMESSAGE API IMPLEMENTATION: CALLBACKS
static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
  // Read first item
  Tuple *t = dict_read_first(iterator);
  var i = 0;
  
  // For all items
  while(t != NULL) {
    // Which key was received?
    switch(t->key) {
      case CARD_IDS:
        
        break;
      case CARD_NAMES:
        
        break;
      case CARD_IDS_BOARDS:
        
        break;
      case CARD_NAMES_BOARDS:
        
        break;
      case CARD_IDS_LISTS:
        
        break;
      case CARD_NAMES_LISTS:
        
        break;
      case CARD_DUE_DATES:
        
        break;
      case CARD_QUANTITY:
        
        break;
      default:
        APP_LOG(APP_LOG_LEVEL_ERROR, "Key %d not recognized!", (int)t->key);
        break;
    }

    // Look for next item
    t = dict_read_next(iterator);
  }
}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
}

static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
}

static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
}


//INIT/DEINIT
static void init() {  
  
  // Register callbacks
  app_message_register_inbox_received(inbox_received_callback);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);
  // Open AppMessage
  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());

  
  //create main Window element and assign to pointer
  s_main_window = window_create();
  
  //set handlers to manage the elements inside the Window
  window_set_window_handlers(s_main_window, (WindowHandlers){
    .load = main_window_load,
    .unload = main_window_unload
  });
  
  //show the Window on the watch, with animated=false;
  window_stack_push(s_main_window, false);
  
  //make sure the time is displayed from the start
  
  //register with TickTimerService to update periodically according to user setting
}

static void deinit() {  
  //destroy Window
  window_destroy(s_main_window);
}


int main(void) {
  init();
  app_event_loop();
  deinit();
}