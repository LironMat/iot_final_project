import { ComponentFixture, TestBed } from '@angular/core/testing';

import MessagesSubscriberComponent from './messages-subscriber.component';

describe('MessagesSubscriberComponent', () => {
  let component: MessagesSubscriberComponent;
  let fixture: ComponentFixture<MessagesSubscriberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesSubscriberComponent],
    });
    fixture = TestBed.createComponent(MessagesSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
